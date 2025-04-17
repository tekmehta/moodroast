import { NextResponse } from 'next/server';
import * as faceapi from 'face-api.js';
import { Canvas, Image, loadImage } from 'canvas';
import path from 'path';
import { randomBytes } from 'crypto';

// Initialize face-api.js with proper type casting
faceapi.env.monkeyPatch({ Canvas: Canvas as any, Image: Image as any });

// Comment history to avoid repetition
type CommentHistory = {
  funnyObservations: Set<string>;
  personalityComments: Set<string>;
  styleAnalyses: Set<string>;
  moodInterpretations: Set<string>;
  vibeChecks: Set<string>;
};

// Initialize with empty sets
const commentHistory: CommentHistory = {
  funnyObservations: new Set(),
  personalityComments: new Set(),
  styleAnalyses: new Set(),
  moodInterpretations: new Set(),
  vibeChecks: new Set(),
};

let modelsLoaded = false;
// Global model path
const modelPath = path.join(process.cwd(), 'public/models');

const loadModels = async () => {
  if (modelsLoaded) return;
  
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath)
    ]);
    modelsLoaded = true;
    console.log('Face-API models loaded successfully for analyzer');
  } catch (error) {
    console.error('Error loading models:', error);
    throw new Error('Failed to load face detection models');
  }
};

// Try to preload models when the file is first imported
loadModels().catch(err => console.warn('Preloading models failed:', err));

export async function POST(request: Request) {
  // Ensure CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const startTime = Date.now();
    
    // Parse request body
    const data = await request.json();
    const imageData = data.imageData;

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400, headers }
      );
    }

    console.log('Analyzing image with local models...');
    
    // Add a unique identifier for this analysis to help with randomization
    const requestId = randomBytes(4).toString('hex');
    
    // Ensure models are loaded
    if (!modelsLoaded) {
      await loadModels();
    }
    
    // Process the image more efficiently
    const base64Data = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;
    
    const buffer = Buffer.from(base64Data, 'base64');
    const img = await loadImage(buffer);
    
    // Use a lower confidence threshold for faster detection
    const detection = await faceapi
      .detectSingleFace(img as any, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 }))
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return NextResponse.json(
        { error: 'No face detected in image' },
        { status: 400, headers }
      );
    }
    
    // Since we don't have expression/age recognition models,
    // we'll use the facial landmarks to generate fun observations
    const landmarks = detection.landmarks;
    const jawOutline = landmarks.getJawOutline();
    const nose = landmarks.getNose();
    const mouth = landmarks.getMouth();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const leftEyebrow = landmarks.getLeftEyeBrow();
    const rightEyebrow = landmarks.getRightEyeBrow();
    
    // Calculate some pseudo-random features from the facial landmarks
    const eyeWidth = Math.abs(rightEye[0].x - leftEye[0].x);
    const mouthWidth = Math.abs(mouth[0].x - mouth[6].x);
    const eyebrowHeight = Math.abs(leftEyebrow[0].y - nose[0].y);
    
    // Generate more varied random expression using the facial features
    const expressions = ['happy', 'thoughtful', 'confident', 'curious', 'focused', 'calm', 'playful', 'mischievous', 'dreamy', 'energetic'];
    const expressionIndex = Math.floor((eyeWidth + mouthWidth) % expressions.length);
    const dominantExpression = expressions[expressionIndex];
    
    // Mock age range based on face descriptor (completely artificial)
    const descriptorSum = detection.descriptor.reduce((sum, val) => sum + val, 0);
    const age = Math.abs(Math.round(descriptorSum * 10) % 40) + 18; // Random age between 18-57
    
    // Generate fun comments based on the analysis, ensuring they're unique
    const funnyObservation = getUniqueComment(
      getFunnyObservation, 
      [dominantExpression, age, requestId],
      commentHistory.funnyObservations
    );
    
    const personalityComment = getUniqueComment(
      getPersonalityComment, 
      [dominantExpression, eyeWidth, mouthWidth, requestId],
      commentHistory.personalityComments
    );
    
    const styleAnalysis = getUniqueComment(
      getStyleAnalysis, 
      [eyebrowHeight, age, requestId],
      commentHistory.styleAnalyses
    );
    
    const moodInterpretation = getUniqueComment(
      getMoodInterpretation, 
      [dominantExpression, mouthWidth, requestId],
      commentHistory.moodInterpretations
    );
    
    const vibeCheck = getUniqueComment(
      getVibeCheck, 
      [dominantExpression, age, requestId],
      commentHistory.vibeChecks
    );
    
    const analysis = `1. ${funnyObservation}\n2. ${personalityComment}\n3. ${styleAnalysis}\n4. ${moodInterpretation}\n5. ${vibeCheck}`;
    
    const processingTime = Date.now() - startTime;
    console.log(`Face analysis completed in ${processingTime}ms`);
    
    return NextResponse.json({ 
      analysis,
      details: {
        faceDetected: true,
        expression: dominantExpression,
        landmarks: {
          jawPoints: jawOutline.length,
          nosePoints: nose.length,
          mouthPoints: mouth.length,
          eyePoints: leftEye.length + rightEye.length
        },
        processingTimeMs: processingTime
      }
    }, { headers });
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Handle other errors
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to analyze image'
      },
      { status: 500, headers }
    );
  }
}

// Function to get a unique comment that hasn't been used recently
function getUniqueComment<T>(
  commentGenerator: (...args: any[]) => string, 
  args: any[], 
  history: Set<string>
): string {
  // Clear history if it gets too large to prevent memory issues
  if (history.size > 20) {
    history.clear();
  }
  
  let attempts = 0;
  let comment;
  
  // Try up to 10 times to get a unique comment
  do {
    comment = commentGenerator(...args);
    attempts++;
    
    // If we've tried 10 times and still getting duplicates, 
    // slightly modify the comment to make it unique
    if (attempts > 10 && history.has(comment)) {
      comment = `${comment} Definitely.`;
      break;
    }
  } while (history.has(comment) && attempts < 10);
  
  // Add to history
  history.add(comment);
  return comment;
}

// Enhanced helper functions with more variety
function getFunnyObservation(expression: string, age: number, requestId: string): string {
  const options = [
    `That ${expression} expression says you're hiding chocolate somewhere.`,
    `Your face screams "I just remembered I left the stove on!"`,
    `You look like you just saw your ex... with your other ex.`,
    `That's the face of someone who knows where all the snacks are hidden.`,
    `You have the expression of someone who forgot their password... again.`,
    `Your face says "I definitely didn't eat the last cookie" but we all know the truth.`,
    `That look definitely says "I can't believe I just said that out loud."`,
    `You're giving "I stayed up all night watching just one more episode" vibes.`,
    `You've got that "I'm pretending to listen but planning dinner" expression down pat.`,
    `This is the face of someone who laughs at their own jokes before telling them.`,
    `Your expression screams "I just remembered an embarrassing moment from 7 years ago."`,
    `You're definitely thinking about that awkward high-five you messed up yesterday.`,
    `This is the classic "pretending to understand what someone just explained" look.`,
    `Your face has "I'm secretly a superhero but don't tell anyone" written all over it.`,
    `That's the universal "I'm totally fine" look that means you're absolutely not fine.`
  ];
  
  // Use request ID to add more randomness
  const seed = parseInt(requestId.substring(0, 8), 16);
  return options[(seed + age) % options.length];
}

function getPersonalityComment(expression: string, eyeWidth: number, mouthWidth: number, requestId: string): string {
  const personalities: Record<string, string[]> = {
    happy: [
      "You're definitely the friend who brings snacks to every gathering.",
      "You're the person who starts spontaneous dance parties in the kitchen.",
      "You're the one who remembers everyone's birthday and makes it special.",
      "Your friends probably have a group chat just to share your hilarious texts.",
      "You could convince a cat to take a bath - that's your level of charisma."
    ],
    thoughtful: [
      "You're the deep thinker in your friend group, contemplating the universe.",
      "You're the friend everyone calls at 2am for life advice.",
      "You probably have a collection of half-filled journals with brilliant insights.",
      "You never leave a conversation without giving someone something to think about.",
      "Your bookshelf is definitely color-coded and organized by philosophical category."
    ],
    confident: [
      "Your confidence is unmistakable - no one messes with your playlist.",
      "You wear mismatched socks not by accident, but as a fashion statement.",
      "You're the friend who gives pep talks that actually work.",
      "You probably make eye contact with lions at the zoo, and they look away first.",
      "You could walk into any room and instantly make it your territory."
    ],
    curious: [
      "Your curious nature makes you excellent at finding hidden gems.",
      "You're probably the one with a browser history full of 'Why do octopuses...' searches.",
      "Your friends are used to your random fact bombs during casual conversations.",
      "You've likely taught yourself at least three unusual skills just because.",
      "Your idea of fun is exploring places most people don't even know exist."
    ],
    focused: [
      "Your focus and determination make you the project finisher in any group.",
      "You're the friend who actually reads the instruction manual... all of it.",
      "When you say you'll do something, everyone knows it's as good as done.",
      "You can probably tune out a rock concert when you're in the zone.",
      "Your to-do lists have to-do lists."
    ],
    calm: [
      "You're the friend everyone calls during a crisis because you never panic.",
      "Your superpower is making chaos feel like a gentle breeze.",
      "You probably meditate without even trying - it's just your natural state.",
      "Even your plants seem more relaxed than everyone else's.",
      "Traffic jams are just opportunities for you to catch up on podcasts."
    ],
    playful: [
      "You're the one who turns everyday errands into adventures.",
      "Your group chats are mostly just you sending memes that are oddly specific.",
      "You've never met a board game you wouldn't immediately suggest house rules for.",
      "You probably still climb trees when no one's looking.",
      "Your inner child isn't just alive, it's running the whole operation."
    ],
    mischievous: [
      "You've perfected the art of the practical joke that makes everyone laugh, even the victim.",
      "Your friends probably check their chairs before sitting down around you.",
      "You likely have a collection of embarrassing photos of everyone you know.",
      "Your innocent face has gotten you out of trouble more times than you can count.",
      "You're the reason your friends have trust issues, but in the best way possible."
    ],
    dreamy: [
      "Your head is perpetually in the clouds, but somehow your feet find their way.",
      "You've probably named all the stars visible from your bedroom window.",
      "Your notes are more doodles than words, but somehow contain brilliant ideas.",
      "Reality is just a suggestion in your world of imagination.",
      "You can find shapes in clouds that no one else sees."
    ],
    energetic: [
      "You probably don't understand why people need coffee in the morning.",
      "Your friends have a special 'contain the enthusiasm' strategy just for you.",
      "You've worn out more shoes in one year than most people do in five.",
      "Sitting still is your idea of extreme sports - nearly impossible.",
      "Your energy levels make hummingbirds look lazy."
    ]
  };
  
  // If expression not found, use this fallback list
  const fallbacks = [
    "You're an enigma wrapped in a mystery - even personality tests are confused.",
    "You've mastered the art of being completely unreadable - poker face champion.",
    "Your personality is like a playlist on shuffle - delightfully unpredictable.",
    "You're the human equivalent of a surprise box - impossible to categorize.",
    "You contain multitudes - trying to describe you is like trying to catch the wind."
  ];
  
  // Get the array for this expression or use fallbacks
  const options = personalities[expression] || fallbacks;
  
  // Use request ID and face measurements for more randomness
  const seed = parseInt(requestId.substring(0, 8), 16);
  return options[(seed + Math.round(eyeWidth + mouthWidth)) % options.length];
}

function getStyleAnalysis(eyebrowHeight: number, age: number, requestId: string): string {
  const styles = [
    "You've got that effortless cool that takes hours to perfect.",
    "Your style says 'I woke up like this' but we know better.",
    "Fashion icon? More like fashion revolution leader.",
    "Your look is what fashion magazines try to capture but never quite can.",
    "You've mastered the art of looking perfectly put-together.",
    "Your style has 'I could be famous and no one would be surprised' energy.",
    "You dress like someone who has a secret playlist that's absolute fire.",
    "Your aesthetic is equal parts sophistication and 'I don't care what anyone thinks.'",
    "You look like you accidentally started three fashion trends last year.",
    "Your style has that rare quality of being both timeless and absolutely current.",
    "You're giving 'I could walk onto a movie set and they'd assume I belong there.'",
    "Your vibe screams 'I know a secret vintage shop that I'll never reveal.'",
    "You're the person others screenshot for style inspiration.",
    "You have that rare ability to make basic look revolutionary.",
    "Your style tells a story that fashion bloggers wish they could write."
  ];
  
  // Use request ID and facial features for more randomness
  const seed = parseInt(requestId.substring(0, 8), 16);
  return styles[(seed + Math.round(eyebrowHeight * 10 + age)) % styles.length];
}

function getMoodInterpretation(expression: string, mouthWidth: number, requestId: string): string {
  const moods: Record<string, string[]> = {
    happy: [
      "You're radiating main character energy right now.",
      "Your mood is brighter than a supernova - sunglasses might be needed.",
      "You're emanating the energy of someone who just found money in an old jacket.",
      "Your current mood is 'just won a lifetime supply of my favorite thing.'",
      "You're vibing like someone who just got complimented by their celebrity crush."
    ],
    thoughtful: [
      "You're in that reflective mood that writes poetry at 2am.",
      "Your mood is like a rainy Sunday with a good book and hot tea.",
      "You're giving 'contemplating the meaning of a song lyric' energy.",
      "Your vibe is 'staring out of a train window while indie music plays.'",
      "You're in that headspace where great ideas are born between daydreams."
    ],
    confident: [
      "You've got that 'don't talk to me until I've had my coffee' energy.",
      "Your mood is saying 'I could run the world but I'd rather not do the paperwork.'",
      "You're exuding the confidence of someone who knows the restaurant owner.",
      "Your vibe is 'I walked into a room and forgot why, but looked good doing it.'",
      "You're in that 'could convince anyone of anything' mindset."
    ],
    curious: [
      "You're in that 'just discovered a new hobby' excitement phase.",
      "Your mood is like a kid in a museum touching everything they shouldn't.",
      "You're giving 'followed a Wikipedia rabbit hole until 3am' energy.",
      "Your vibe is 'paused mid-conversation to google a random fact.'",
      "You're in that headspace where everything seems fascinating and worth exploring."
    ],
    focused: [
      "You're giving 'just saw the plot twist' vibes.",
      "Your mood is 'deadline in 20 minutes but completely calm.'",
      "You're emanating 'in the zone' energy that no one dares interrupt.",
      "Your vibe is 'solving a complex puzzle while making it look easy.'",
      "You're in that rare state of flow where time disappears."
    ],
    calm: [
      "Your mood is smoother than jazz on a summer evening.",
      "You're vibing like someone who just finished a perfect meditation session.",
      "You're giving 'ocean waves at sunset' energy - perfectly serene.",
      "Your current state is 'nothing can ruffle these feathers.'",
      "You're the human equivalent of a spa day right now."
    ],
    playful: [
      "Your mood is bubblier than champagne at a celebration.",
      "You're giving 'found the perfect song for this moment' energy.",
      "You're vibing like someone who's about to suggest a spontaneous road trip.",
      "Your current mood is 'life is a game and I'm winning.'",
      "You're emanating the joy of someone who just remembered it's a three-day weekend."
    ],
    mischievous: [
      "You're giving 'I know something you don't know' energy.",
      "Your mood is 'innocent smile but definitely planning something.'",
      "You're vibing like someone with a brilliant prank in the works.",
      "Your current state is 'butter wouldn't melt but ideas are simmering.'",
      "You're the human embodiment of that smirk emoji right now."
    ],
    dreamy: [
      "Your mood is floating somewhere between this realm and the next.",
      "You're giving 'lost in a daydream' energy that's absolutely captivating.",
      "You're vibing like someone who just remembered a beautiful dream.",
      "Your current state is 'physically here, mentally designing a fantasy world.'",
      "You're emanating the peace of someone who's found their happy place."
    ],
    energetic: [
      "Your mood is more charged than a battery factory.",
      "You're giving 'just discovered coffee' energy, even if you don't drink it.",
      "You're vibing like someone who wakes up ready to conquer mountains.",
      "Your current state is 'could probably run a marathon on a whim.'",
      "You're the human equivalent of a firework display right now."
    ]
  };
  
  // Fallback if no match
  const fallbacks = [
    "Your mood is as mysterious as a cat's thoughts.",
    "You're in a state that psychologists haven't named yet.",
    "Your current mood is indescribable - but in the most intriguing way.",
    "You're vibing on a frequency that defies conventional categorization.",
    "Your mood is like a complex wine - notes of everything, dominated by nothing."
  ];
  
  // Get the array for this expression or use fallbacks
  const options = moods[expression] || fallbacks;
  
  // Use request ID and mouth width for more randomness
  const seed = parseInt(requestId.substring(0, 8), 16);
  return options[(seed + Math.round(mouthWidth * 5)) % options.length];
}

function getVibeCheck(expression: string, age: number, requestId: string): string {
  const vibes = [
    "Immaculate vibes. Chef's kiss. 10/10 no notes.",
    "Your aura is that perfect mix of chaos and charm.",
    "You're radiating 'main character energy' right now.",
    "The vibe check results are in: you're absolutely killing it.",
    "Your energy could power a small city right now.",
    "Your vibe is elite - the kind people try to bottle and sell.",
    "You're serving looks, energy, and vibes that cannot be replicated.",
    "Vibe check passed with flying colors and bonus points.",
    "You're giving off frequencies that make plants grow and people smile.",
    "Your aura has auras - that's how powerful your presence is.",
    "The vibe is immaculate, curated, and absolutely authentic.",
    "You're exuding that rare energy that makes everyone feel at ease.",
    "Your vibe is contagious - spreading good energy wherever you go.",
    "You pass the vibe check so hard you're setting new standards.",
    "Your energy field is the perfect blend of magnetic and mysterious."
  ];
  
  // Use request ID and age for more randomness
  const seed = parseInt(requestId.substring(0, 8), 16);
  return vibes[(seed + age) % vibes.length];
} 