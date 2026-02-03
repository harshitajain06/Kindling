// OpenAI API Configuration
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Generate AI-powered parenting style analysis
 * @param {Object} questionnaireResults - The results from the parenting style questionnaire
 * @returns {Promise<Object>} - AI-generated analysis
 */
export const generateParentingAnalysis = async (questionnaireResults) => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here' || OPENAI_API_KEY.trim() === '') {
      throw new Error('OpenAI API key not configured');
    }

    const { dominantStyle, counts, answers } = questionnaireResults;
    
    // Create detailed context for the AI
    const contextPrompt = createAnalysisPrompt(questionnaireResults);
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert child psychologist and parenting coach with 20+ years of experience. You specialize in analyzing parenting approaches and providing evidence-based recommendations for positive parenting development. IMPORTANT: Never use parenting style labels like "Authoritarian", "Permissive", "Authoritative", "Neglectful", or "Mixed" in your analysis. Instead, describe the parent's approach using descriptive terms like "structured", "warm", "balanced", "flexible", etc. Focus on behaviors and characteristics, not labels.`
          },
          {
            role: 'user',
            content: contextPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse the AI response into structured data
    return parseAnalysisResponse(analysisText, questionnaireResults);
    
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    throw error;
  }
};

/**
 * Create a detailed prompt for AI analysis
 */
const createAnalysisPrompt = (questionnaireResults) => {
  const { dominantStyle, counts, answers } = questionnaireResults;
  
  const questionMapping = {
    A1: "I explain the reason behind the rules (not just \"because I said so\").",
    A2: "I set clear expectations, and I'm open to discussion if my teen disagrees respectfully.",
    A3: "When my teen messes up, we focus on learning and consequences—not shame.",
    A4: "I encourage independence while still setting boundaries.",
    A5: "I regularly check in on feelings (stress, friendships, mood) and listen fully.",
    B1: "I expect immediate obedience when I give an instruction.",
    B2: "I believe strict rules matter more than my teen's opinion in family decisions.",
    B3: "I use punishment to enforce compliance (even if my teen doesn't understand why).",
    B4: "If my teen questions a rule, I see it as disrespectful.",
    B5: "I raise my voice or use threats when my teen won't cooperate.",
    C1: "I avoid setting firm rules because I don't want conflict.",
    C2: "If my teen strongly resists, I often give in to keep peace.",
    C3: "I prefer being a friend to my teen rather than enforcing discipline.",
    C4: "My teen decides most things (sleep, screen time, study routine) with minimal limits.",
    C5: "Even when rules exist, I don't consistently follow through on consequences.",
    D1: "I'm often too busy/tired to notice my teen's emotional state.",
    D2: "I rarely track school deadlines, friendships, or daily routines.",
    D3: "I don't have clear expectations about behavior at home.",
    D4: "When problems come up, I tend to disengage rather than address them.",
    D5: "I spend very little one-on-one time talking or doing activities with my teen."
  };

  let prompt = `Please analyze this parenting assessment and provide a comprehensive analysis. Here are the results:

**Assessment Results:**
- Score Breakdown (mean scores 1-5): ${JSON.stringify(counts)}
${questionnaireResults.confidence !== undefined ? `- Confidence Score: ${questionnaireResults.confidence.toFixed(2)} (${questionnaireResults.confidenceLevel || 'unknown'} confidence)` : ''}

**Detailed Responses:**
`;

  // Add each question and answer
  Object.entries(answers).forEach(([questionId, answerValue]) => {
    const questionText = questionMapping[questionId];
    const likertLabel = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'][answerValue - 1] || answerValue;
    prompt += `\nQuestion ${questionId}: ${questionText}\nAnswer: ${answerValue} (${likertLabel})\n`;
  });

  prompt += `

Please provide a comprehensive analysis that includes:

1. **Overall Assessment**: A detailed analysis of the parenting approach based on the responses. DO NOT use parenting style labels like "Authoritarian", "Permissive", "Authoritative", "Neglectful", or "Mixed". Instead, describe their approach using descriptive terms.
2. **Strengths**: Specific strengths of this parenting approach
3. **Areas for Growth**: Areas where the parent could improve
4. **Child Development Impact**: How this approach likely affects the child's development
5. **Specific Recommendations**: 3-5 actionable recommendations for improvement
6. **Long-term Considerations**: What to consider for the child's future development
7. **Balancing Act**: How to maintain strengths while addressing growth areas

IMPORTANT: Never mention parenting style types like "Authoritarian", "Permissive", "Authoritative", "Neglectful", or "Mixed" anywhere in your response. Use descriptive language about their parenting behaviors and characteristics instead.

Please be encouraging, evidence-based, and practical in your recommendations. Focus on positive parenting techniques and child development research.`;

  return prompt;
};

/**
 * Parse the AI response into structured data
 */
const parseAnalysisResponse = (analysisText, questionnaireResults) => {
  // Try to extract structured sections from the AI response
  const sections = {
    overallAssessment: '',
    strengths: [],
    areasForGrowth: [],
    childDevelopmentImpact: '',
    specificRecommendations: [],
    longTermConsiderations: '',
    balancingAct: ''
  };

  // Simple parsing - in a real app, you might want more sophisticated parsing
  const lines = analysisText.split('\n');
  let currentSection = 'overallAssessment';
  let currentList = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.toLowerCase().includes('overall assessment') || 
        trimmedLine.toLowerCase().includes('assessment:')) {
      currentSection = 'overallAssessment';
    } else if (trimmedLine.toLowerCase().includes('strengths') || 
               trimmedLine.toLowerCase().includes('strength:')) {
      currentSection = 'strengths';
      currentList = [];
    } else if (trimmedLine.toLowerCase().includes('areas for growth') || 
               trimmedLine.toLowerCase().includes('improvement') ||
               trimmedLine.toLowerCase().includes('growth:')) {
      currentSection = 'areasForGrowth';
      currentList = [];
    } else if (trimmedLine.toLowerCase().includes('child development') || 
               trimmedLine.toLowerCase().includes('development impact')) {
      currentSection = 'childDevelopmentImpact';
    } else if (trimmedLine.toLowerCase().includes('recommendations') || 
               trimmedLine.toLowerCase().includes('recommendation:')) {
      currentSection = 'specificRecommendations';
      currentList = [];
    } else if (trimmedLine.toLowerCase().includes('long-term') || 
               trimmedLine.toLowerCase().includes('future')) {
      currentSection = 'longTermConsiderations';
    } else if (trimmedLine.toLowerCase().includes('balancing') || 
               trimmedLine.toLowerCase().includes('balance')) {
      currentSection = 'balancingAct';
    } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./)) {
      // This is a list item
      const cleanItem = trimmedLine.replace(/^[-•\d+\.\s]+/, '').trim();
      if (cleanItem) {
        currentList.push(cleanItem);
      }
    } else if (trimmedLine && !trimmedLine.match(/^[A-Z\s]+:$/)) {
      // This is regular text content
      if (currentSection === 'overallAssessment' || 
          currentSection === 'childDevelopmentImpact' || 
          currentSection === 'longTermConsiderations' || 
          currentSection === 'balancingAct') {
        sections[currentSection] += (sections[currentSection] ? ' ' : '') + trimmedLine;
      }
    }
  });

  // Assign list items to their respective sections
  if (currentSection === 'strengths') {
    sections.strengths = currentList;
  } else if (currentSection === 'areasForGrowth') {
    sections.areasForGrowth = currentList;
  } else if (currentSection === 'specificRecommendations') {
    sections.specificRecommendations = currentList;
  }

  return {
    ...sections,
    rawAnalysis: analysisText,
    questionnaireResults,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Generate a polite, encouraging quote using OpenAI after sentiment analysis
 * @param {Object} questionnaireResults - The results from the parenting style questionnaire
 * @returns {Promise<string>} - A polite, encouraging quote
 */
export const generateEncouragingQuote = async (questionnaireResults) => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here' || OPENAI_API_KEY.trim() === '') {
      throw new Error('OpenAI API key not configured');
    }

    const { dominantStyle, counts, answers } = questionnaireResults;
    
    // Analyze sentiment and generate quote
    const questionMapping = {
      A1: "I explain the reason behind the rules (not just \"because I said so\").",
      A2: "I set clear expectations, and I'm open to discussion if my teen disagrees respectfully.",
      A3: "When my teen messes up, we focus on learning and consequences—not shame.",
      A4: "I encourage independence while still setting boundaries.",
      A5: "I regularly check in on feelings (stress, friendships, mood) and listen fully.",
      B1: "I expect immediate obedience when I give an instruction.",
      B2: "I believe strict rules matter more than my teen's opinion in family decisions.",
      B3: "I use punishment to enforce compliance (even if my teen doesn't understand why).",
      B4: "If my teen questions a rule, I see it as disrespectful.",
      B5: "I raise my voice or use threats when my teen won't cooperate.",
      C1: "I avoid setting firm rules because I don't want conflict.",
      C2: "If my teen strongly resists, I often give in to keep peace.",
      C3: "I prefer being a friend to my teen rather than enforcing discipline.",
      C4: "My teen decides most things (sleep, screen time, study routine) with minimal limits.",
      C5: "Even when rules exist, I don't consistently follow through on consequences.",
      D1: "I'm often too busy/tired to notice my teen's emotional state.",
      D2: "I rarely track school deadlines, friendships, or daily routines.",
      D3: "I don't have clear expectations about behavior at home.",
      D4: "When problems come up, I tend to disengage rather than address them.",
      D5: "I spend very little one-on-one time talking or doing activities with my teen."
    };

    let assessmentContext = `Based on your parenting assessment, here are your responses:\n\n`;
    
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const questionText = questionMapping[questionId];
      const likertLabel = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'][answerValue - 1] || answerValue;
      assessmentContext += `Question ${questionId}: ${questionText}\nAnswer: ${answerValue} (${likertLabel})\n\n`;
    });

    assessmentContext += `Score breakdown: ${JSON.stringify(counts)}\n`;
    assessmentContext += `Your responses show a balanced approach to parenting with strengths in various areas.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate parenting coach and child development expert. Your role is to analyze parenting assessment responses with empathy and generate a warm, encouraging, and inspirational quote that celebrates the parent's unique approach without using labels like "Authoritarian Parent" or other parenting style names. The quote should be positive, uplifting, and focus on strengths and growth potential. Keep it brief (2-3 sentences maximum) and make it feel personal and heartfelt.`
          },
          {
            role: 'user',
            content: `Please analyze these parenting assessment responses and generate a kind, encouraging quote that celebrates this parent's journey. Do not mention any parenting style labels. Focus on their strengths, their commitment to their child, and their growth potential. Make it warm and inspiring.

${assessmentContext}

Generate a brief, heartfelt quote (2-3 sentences) that encourages this parent.`
          }
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const quote = data.choices[0].message.content.trim();
    
    return quote;
    
  } catch (error) {
    console.error('Error generating encouraging quote:', error);
    // Return a fallback quote if API fails
    return generateFallbackQuote(questionnaireResults);
  }
};

/**
 * Generate a descriptive parenting style title without labels
 * @param {Object} questionnaireResults - The results from the parenting style questionnaire
 * @returns {Promise<string>} - A short, descriptive title (1-2 sentences)
 */
export const generateDescriptiveTitle = async (questionnaireResults) => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here' || OPENAI_API_KEY.trim() === '') {
      throw new Error('OpenAI API key not configured');
    }

    const { dominantStyle, counts, answers } = questionnaireResults;
    
    const questionMapping = {
      A1: "I explain the reason behind the rules (not just \"because I said so\").",
      A2: "I set clear expectations, and I'm open to discussion if my teen disagrees respectfully.",
      A3: "When my teen messes up, we focus on learning and consequences—not shame.",
      A4: "I encourage independence while still setting boundaries.",
      A5: "I regularly check in on feelings (stress, friendships, mood) and listen fully.",
      B1: "I expect immediate obedience when I give an instruction.",
      B2: "I believe strict rules matter more than my teen's opinion in family decisions.",
      B3: "I use punishment to enforce compliance (even if my teen doesn't understand why).",
      B4: "If my teen questions a rule, I see it as disrespectful.",
      B5: "I raise my voice or use threats when my teen won't cooperate.",
      C1: "I avoid setting firm rules because I don't want conflict.",
      C2: "If my teen strongly resists, I often give in to keep peace.",
      C3: "I prefer being a friend to my teen rather than enforcing discipline.",
      C4: "My teen decides most things (sleep, screen time, study routine) with minimal limits.",
      C5: "Even when rules exist, I don't consistently follow through on consequences.",
      D1: "I'm often too busy/tired to notice my teen's emotional state.",
      D2: "I rarely track school deadlines, friendships, or daily routines.",
      D3: "I don't have clear expectations about behavior at home.",
      D4: "When problems come up, I tend to disengage rather than address them.",
      D5: "I spend very little one-on-one time talking or doing activities with my teen."
    };

    let assessmentContext = `Based on your parenting assessment:\n\n`;
    
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const questionText = questionMapping[questionId];
      const likertLabel = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'][answerValue - 1] || answerValue;
      assessmentContext += `Question ${questionId}: ${questionText}\nAnswer: ${answerValue} (${likertLabel})\n\n`;
    });

    assessmentContext += `Score breakdown: ${JSON.stringify(counts)}`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a compassionate parenting coach. Generate a short, descriptive title (1-2 sentences maximum, keep it concise) that describes this parent's unique parenting approach based on their assessment responses. Do NOT use labels like "Authoritarian Parent", "Permissive Parent", etc. Instead, describe their parenting style in a warm, positive way that highlights their approach and characteristics. Examples: "You balance structure with warmth beautifully" or "Your parenting emphasizes clear boundaries and emotional support" or "You create a loving environment where your child feels heard and valued". Make it descriptive and encouraging.`
          },
          {
            role: 'user',
            content: `Based on these parenting assessment responses, generate a short descriptive title (1-2 sentences) that describes this parent's unique approach without using any parenting style labels.

${assessmentContext}

Generate a concise, warm, and descriptive title.`
          }
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const title = data.choices[0].message.content.trim();
    
    return title;
    
  } catch (error) {
    console.error('Error generating descriptive title:', error);
    // Return a fallback descriptive title
    return generateFallbackDescriptiveTitle(questionnaireResults);
  }
};

/**
 * Generate a fallback descriptive title when OpenAI is not available
 */
const generateFallbackDescriptiveTitle = (questionnaireResults) => {
  const { dominantStyle, counts } = questionnaireResults;
  const maxScore = Math.max(...Object.values(counts));
  
  const fallbackTitles = {
    Authoritative: "You balance warmth and structure beautifully, creating a nurturing environment for your child to thrive.",
    Authoritarian: "Your parenting emphasizes clear boundaries, discipline, and respect, setting high expectations for your child.",
    Permissive: "You prioritize your child's happiness and freedom, showing them lots of love and acceptance.",
    Neglectful: "You're on a journey to strengthen your parenting connection, and every step forward matters."
  };
  
  return fallbackTitles[dominantStyle] || "Your unique parenting approach reflects thoughtful consideration of your child's needs.";
};

/**
 * Generate a fallback quote when OpenAI is not available
 */
const generateFallbackQuote = (questionnaireResults) => {
  const { counts } = questionnaireResults;
  const totalScore = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const maxScore = Math.max(...Object.values(counts));
  
  // Generate a generic encouraging quote based on the assessment
  if (maxScore >= 7) {
    return "Your commitment to your child's growth shines through in your thoughtful responses. Every day brings new opportunities to nurture their development with love and understanding. Keep trusting your instincts as you guide them through life's beautiful journey.";
  } else if (maxScore >= 5) {
    return "Your parenting journey reflects a beautiful balance of care and consideration. There's so much potential for growth and connection ahead. Remember, the most important gift you can give your child is your presence and your willingness to learn and grow together.";
  } else {
    return "Taking this assessment shows your dedication to being the best parent you can be. Every small step you take towards understanding and connecting with your child makes a meaningful difference. Your willingness to grow and learn is already making a positive impact.";
  }
};

/**
 * Fallback analysis when OpenAI is not available
 */
export const generateFallbackAnalysis = (questionnaireResults) => {
  const { dominantStyle, counts } = questionnaireResults;
  
  const fallbackAnalyses = {
    Authoritative: {
      overallAssessment: "Your responses indicate a balanced and effective parenting approach. You balance warmth and structure effectively, showing both responsiveness to your child's needs and clear expectations.",
      strengths: [
        "Excellent balance between support and structure",
        "Strong communication and reasoning skills",
        "Consistent yet flexible approach to discipline",
        "High emotional responsiveness to your child"
      ],
      areasForGrowth: [
        "Continue to maintain consistency in your approach",
        "Consider your child's developmental stage when setting expectations",
        "Ensure you're taking care of your own needs as well"
      ],
      childDevelopmentImpact: "Children raised with this balanced approach typically develop strong self-esteem, good social skills, and academic success. They tend to be independent, responsible, and emotionally well-adjusted.",
      specificRecommendations: [
        "Maintain your current approach as it's working well",
        "Continue open communication with your child",
        "Stay consistent with rules and consequences",
        "Keep encouraging your child's independence"
      ],
      longTermConsiderations: "Your approach sets a strong foundation for your child's future success. Continue to adapt your parenting style as your child grows and their needs change.",
      balancingAct: "You're already doing well at balancing structure with warmth. Continue to listen to your child while maintaining appropriate boundaries."
    },
    Authoritarian: {
      overallAssessment: "Your responses suggest a structured parenting approach with high expectations and clear discipline. While structure is important, there may be opportunities to incorporate more warmth and explanation.",
      strengths: [
        "Clear rules and expectations",
        "Strong sense of responsibility",
        "Consistent discipline approach",
        "High standards for behavior"
      ],
      areasForGrowth: [
        "Add more warmth and emotional support",
        "Explain the reasoning behind rules more often",
        "Allow for more discussion and input from your child",
        "Consider your child's perspective more frequently"
      ],
      childDevelopmentImpact: "While children may follow rules well, they might struggle with independence, creativity, and self-esteem. They may also have difficulty making decisions on their own.",
      specificRecommendations: [
        "Start explaining why rules exist",
        "Ask for your child's input on family decisions",
        "Show more affection and emotional support",
        "Allow your child to make some age-appropriate choices"
      ],
      longTermConsiderations: "Consider how your approach might affect your child's ability to think independently and develop their own values as they grow older.",
      balancingAct: "Try to maintain your high standards while adding more warmth and explanation. Your child will benefit from understanding the 'why' behind the rules."
    },
    Permissive: {
      overallAssessment: "Your responses indicate a warm and nurturing parenting approach where you prioritize your child's happiness and freedom. While this creates a loving environment, adding some structure could benefit both you and your child.",
      strengths: [
        "High emotional warmth and support",
        "Strong parent-child bond",
        "Child feels heard and valued",
        "Encourages creativity and self-expression"
      ],
      areasForGrowth: [
        "Set more consistent boundaries and rules",
        "Practice saying 'no' when necessary",
        "Help your child understand consequences",
        "Establish more structure in daily routines"
      ],
      childDevelopmentImpact: "Children may feel loved and accepted, but they might struggle with self-control, following rules, and understanding limits. They may have difficulty with authority figures later in life.",
      specificRecommendations: [
        "Start with small, consistent rules",
        "Explain the importance of boundaries to your child",
        "Practice enforcing consequences calmly",
        "Set up regular routines for meals, bedtime, etc."
      ],
      longTermConsiderations: "Your child will need to learn to function in a world with rules and expectations. Gradually introducing structure will help them develop these important life skills.",
      balancingAct: "You can maintain your loving, supportive approach while adding appropriate structure. Your child will still feel loved while learning important life skills."
    },
    Neglectful: {
      overallAssessment: "Your responses suggest some challenges in your parenting approach. It's important to remember that seeking help and making changes is a sign of strength, not weakness. Small steps can make a big difference.",
      strengths: [
        "Self-awareness about your parenting challenges",
        "Potential for significant positive change",
        "Opportunity to build stronger connections"
      ],
      areasForGrowth: [
        "Increase emotional connection with your child",
        "Set basic rules and expectations",
        "Spend more quality time together",
        "Seek support from family, friends, or professionals"
      ],
      childDevelopmentImpact: "Children may develop independence early but might struggle with emotional regulation, trust, and forming healthy relationships. Early intervention can help prevent long-term issues.",
      specificRecommendations: [
        "Start with 15 minutes of focused time with your child daily",
        "Set one simple rule and stick to it",
        "Consider seeking professional support or counseling",
        "Ask for help from trusted family members or friends"
      ],
      longTermConsiderations: "It's never too late to improve your parenting approach. Your child will benefit greatly from increased attention, structure, and emotional support.",
      balancingAct: "Focus on building connection first, then gradually add structure. Your child needs to feel loved and secure before they can learn to follow rules."
    }
  };

  return {
    ...fallbackAnalyses[dominantStyle],
    rawAnalysis: "This is a fallback analysis. For more detailed insights, please configure the OpenAI API key.",
    questionnaireResults,
    generatedAt: new Date().toISOString(),
    isFallback: true
  };
};

