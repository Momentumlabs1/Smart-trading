import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Check } from 'lucide-react';
import { FUNNEL_DATA, NODE_ORDER, type FunnelNode } from '@/lib/funnel-data';
import { cn } from '@/lib/utils';

interface FunnelPlayerProps {
  onClose?: () => void;
  webhookUrl?: string;
}

interface Response {
  nodeId: string;
  answer: string | number | boolean;
  answerType: string;
  timestamp: string;
}

export const FunnelPlayer = ({ onClose, webhookUrl }: FunnelPlayerProps) => {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [leadData, setLeadData] = useState<Record<string, string> | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionId = useRef(`session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`);

  const nodes = FUNNEL_DATA.nodes;
  const edges = FUNNEL_DATA.edges;

  // Find node by ID
  const findNode = useCallback((id: string) => nodes.find(n => n.id === id), [nodes]);

  // Find next node with routing
  const findNextNode = useCallback((nodeId: string, routingKey = 'default'): FunnelNode | null => {
    const node = findNode(nodeId);
    if (!node) return null;

    // 1. Try nextNodes with specific key
    const nextNodes = node.data?.nextNodes;
    if (nextNodes) {
      if (nextNodes[routingKey]) {
        return findNode(nextNodes[routingKey]) || null;
      }
      if (routingKey !== 'default' && nextNodes['default']) {
        return findNode(nextNodes['default']) || null;
      }
    }

    // 2. Try edges
    const edge = edges.find(e => e.source === nodeId);
    if (edge) {
      return findNode(edge.target) || null;
    }

    // 3. Sequential fallback
    const currentIndex = NODE_ORDER.indexOf(nodeId);
    if (currentIndex >= 0 && currentIndex < NODE_ORDER.length - 1) {
      const nextId = NODE_ORDER[currentIndex + 1];
      return findNode(nextId) || null;
    }

    return null;
  }, [findNode, edges]);

  // Check if node needs user interaction
  const nodeNeedsInteraction = useCallback((node: FunnelNode): boolean => {
    const answerType = node.data?.answerType;
    if (answerType === 'none' || !answerType) return false;
    if (['button', 'yesno', 'text', 'email', 'rating'].includes(answerType)) return true;
    if (answerType === 'multipleChoice') {
      return Array.isArray(node.data?.answers) && node.data.answers.length > 0;
    }
    return false;
  }, []);

  // iOS-FIX: Start funnel with user gesture (sound works!)
  const startFunnel = useCallback(() => {
    // User has clicked = browser allows sound (User Gesture)
    setIsMuted(false);
    setIsStarted(true);

    const startNode = nodes.find(n => n.type === 'start');
    const nextNode = findNextNode(startNode?.id || '');

    if (nextNode) {
      // IMMEDIATE render without 300ms delay (User Gesture preserved!)
      setCurrentNodeId(nextNode.id);
      setButtonsVisible(false);
      setSelectedRating(0);
      setTextInput('');
    }
  }, [nodes, findNextNode]);

  // Go to node with crossfade transition
  const goToNode = useCallback((nodeId: string) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentNodeId(nodeId);
      setButtonsVisible(false);
      setSelectedRating(0);
      setTextInput('');
      setProgress(0);
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Handle answer
  const handleAnswer = useCallback((answer: string | number | boolean, answerType: string) => {
    const node = findNode(currentNodeId || '');
    if (!node) return;

    // Save response
    const response: Response = {
      nodeId: currentNodeId || '',
      answer,
      answerType,
      timestamp: new Date().toISOString()
    };
    setResponses(prev => [...prev, response]);

    // Determine routing key
    let routingKey = 'default';
    if (answerType === 'multipleChoice') {
      routingKey = String(answer);
    } else if (answerType === 'yesno') {
      routingKey = answer ? 'yes' : 'no';
    } else if (answerType === 'rating') {
      const ratingNum = typeof answer === 'number' ? answer : parseInt(String(answer));
      if (ratingNum <= 2) routingKey = 'low';
      else if (ratingNum <= 4) routingKey = 'medium';
      else routingKey = 'high';
    }

    // Find next node
    const nextNode = findNextNode(currentNodeId || '', routingKey);
    if (nextNode) {
      goToNode(nextNode.id);
    }
  }, [currentNodeId, findNode, findNextNode, goToNode]);

  // Video timeupdate handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const node = findNode(currentNodeId || '');
    if (!node || node.type !== 'video') return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        setProgress((currentTime / duration) * 100);

        // Button visibility logic
        const delay = node.data.delaySeconds ?? node.data.delayBeforeButtons ?? 0;
        const needsInteraction = nodeNeedsInteraction(node);

        if (!buttonsVisible && needsInteraction && currentTime >= delay) {
          setButtonsVisible(true);
        }
      }
    };

    const handleEnded = () => {
      if (!nodeNeedsInteraction(node)) {
        const nextNode = findNextNode(node.id);
        if (nextNode) {
          goToNode(nextNode.id);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentNodeId, buttonsVisible, findNode, nodeNeedsInteraction, findNextNode, goToNode]);

  // Play video when node changes
  useEffect(() => {
    const video = videoRef.current;
    const node = findNode(currentNodeId || '');
    
    if (video && node?.type === 'video' && node.data.videoUrl) {
      video.muted = isMuted;
      video.play().catch(e => {
        console.log('Sound blocked, fallback to muted:', e);
        setIsMuted(true);
        video.muted = true;
        video.play().catch(err => console.log('Even muted play blocked:', err));
      });
    }
  }, [currentNodeId, isMuted, findNode]);

  const currentNode = findNode(currentNodeId || '');
  const startNode = nodes.find(n => n.type === 'start');
  const firstVideoNode = findNextNode(startNode?.id || '');

  // Button color mapping
  const getButtonColor = (colorName?: string): string => {
    const colorMap: Record<string, string> = {
      'yellow': '#facc15',
      'purple': '#a855f7',
      'blue': '#3b82f6',
      'green': '#22c55e',
      'red': '#ef4444',
      'orange': '#f97316',
      'pink': '#ec4899',
      'cyan': '#06b6d4',
      'white': '#ffffff',
      'gray': '#6b7280'
    };
    if (colorName?.startsWith('#')) return colorName;
    return colorMap[colorName || 'yellow'] || colorMap['yellow'];
  };

  const buttonColor = getButtonColor(currentNode?.data?.buttonColor);

  // Handle lead form submit
  const handleLeadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as Record<string, string>;
    setLeadData(data);

    const nextNode = findNextNode(currentNodeId || '');
    if (nextNode) {
      goToNode(nextNode.id);
    }
  };

  // Render Start Screen
  if (!isStarted) {
    return (
      <div className="funnel-player w-full max-w-[400px] h-full max-h-[711px] bg-black rounded-3xl overflow-hidden relative shadow-2xl">
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0a]"
          onClick={startFunnel}
        >
          {firstVideoNode?.data?.videoUrl && (
            <video 
              src={firstVideoNode.data.videoUrl} 
              muted 
              loop 
              autoPlay 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <button 
            className="w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 z-10"
            style={{ 
              background: buttonColor,
              boxShadow: `0 0 40px ${buttonColor}40`
            }}
          >
            <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
          </button>
        </div>
      </div>
    );
  }

  // Render Video Node
  if (currentNode?.type === 'video') {
    return (
      <motion.div 
        className="funnel-player w-full max-w-[400px] h-full max-h-[711px] bg-black rounded-3xl overflow-hidden relative shadow-2xl"
        style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.3s ease' }}
      >
        <div className="absolute inset-0 flex flex-col">
          {/* Progress Bar */}
          <div className="h-1 bg-white/20 relative z-20">
            <div 
              className="h-full transition-all duration-100"
              style={{ width: `${progress}%`, background: buttonColor }}
            />
          </div>

          {/* Video */}
          <video
            ref={videoRef}
            src={currentNode.data.videoUrl || ''}
            playsInline
            muted={isMuted}
            className="flex-1 w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10">
            {currentNode.data.overlayText && (
              <p className="text-lg font-semibold mb-4 text-shadow-lg text-white">
                {currentNode.data.overlayText}
              </p>
            )}

            {/* Buttons Container */}
            <div 
              className={cn(
                "flex flex-col gap-3 transition-all duration-500",
                buttonsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
              )}
            >
              {/* Button / CTA */}
              {currentNode.data.answerType === 'button' && (
                <button
                  onClick={() => handleAnswer('continue', 'button')}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: buttonColor }}
                >
                  {currentNode.data.buttonText || 'Weiter'} →
                </button>
              )}

              {/* Multiple Choice */}
              {currentNode.data.answerType === 'multipleChoice' && currentNode.data.answers?.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index, 'multipleChoice')}
                  className={cn(
                    "w-full py-4 px-6 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
                    index === 0 ? "text-black" : "text-white bg-white/15 backdrop-blur-md"
                  )}
                  style={index === 0 ? { background: buttonColor } : undefined}
                >
                  {answer}
                </button>
              ))}

              {/* Yes/No */}
              {currentNode.data.answerType === 'yesno' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAnswer(true, 'yesno')}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold bg-green-500 text-white transition-all hover:scale-[1.02]"
                  >
                    ✓ {currentNode.data.yesText || 'Ja'}
                  </button>
                  <button
                    onClick={() => handleAnswer(false, 'yesno')}
                    className="flex-1 py-4 px-6 rounded-xl font-semibold bg-red-500 text-white transition-all hover:scale-[1.02]"
                  >
                    ✗ {currentNode.data.noText || 'Nein'}
                  </button>
                </div>
              )}

              {/* Text/Email Input */}
              {(currentNode.data.answerType === 'text' || currentNode.data.answerType === 'email') && (
                <div className="flex flex-col gap-3">
                  <input
                    type={currentNode.data.answerType === 'email' ? 'email' : 'text'}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={currentNode.data.placeholder || (currentNode.data.answerType === 'email' ? 'E-Mail eingeben...' : 'Antwort eingeben...')}
                    className="w-full py-4 px-4 rounded-xl border border-white/30 bg-black/60 text-white placeholder:text-white/50 backdrop-blur-md focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => textInput.trim() && handleAnswer(textInput.trim(), 'text')}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-black transition-all hover:scale-[1.02]"
                    style={{ background: buttonColor }}
                  >
                    Weiter →
                  </button>
                </div>
              )}

              {/* Rating */}
              {currentNode.data.answerType === 'rating' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <svg 
                          viewBox="0 0 24 24" 
                          className="w-8 h-8 transition-colors"
                          fill={rating <= selectedRating ? '#facc15' : '#4b5563'}
                          stroke={rating <= selectedRating ? '#facc15' : '#4b5563'}
                          strokeWidth="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => selectedRating > 0 && handleAnswer(selectedRating, 'rating')}
                    disabled={selectedRating === 0}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-black transition-all hover:scale-[1.02] disabled:opacity-50"
                    style={{ background: buttonColor }}
                  >
                    Bewertung abgeben
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center z-20 transition-all hover:bg-white/25"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // Render Lead Capture Node
  if (currentNode?.type === 'leadCapture') {
    const fieldLabels: Record<string, string> = {
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      age: 'Alter'
    };

    return (
      <motion.div 
        className="funnel-player w-full max-w-[400px] h-full max-h-[711px] bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0a] rounded-3xl overflow-hidden relative shadow-2xl p-8 flex flex-col"
        style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.3s ease' }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {currentNode.data.title || 'Kontaktdaten'}
        </h2>
        <p className="text-white/70 mb-6">
          {currentNode.data.description || 'Bitte geben Sie Ihre Daten ein'}
        </p>

        <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 flex-1">
          {(currentNode.data.fields || ['firstName', 'lastName', 'email']).map(field => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-white">
                {fieldLabels[field] || field}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'age' ? 'number' : 'text'}
                name={field}
                required={['firstName', 'email'].includes(field)}
                placeholder={fieldLabels[field] || field}
                className="w-full py-3 px-4 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-primary"
              />
            </div>
          ))}

          {currentNode.data.optInText && (
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                name="optIn"
                id="optIn"
                className="w-5 h-5 mt-0.5"
              />
              <label htmlFor="optIn" className="text-sm text-white/80">
                {currentNode.data.optInText}
              </label>
            </div>
          )}

          <button
            type="submit"
            className="mt-auto w-full py-4 px-6 rounded-xl font-semibold text-black transition-all hover:scale-[1.02]"
            style={{ background: buttonColor }}
          >
            Absenden →
          </button>
        </form>
      </motion.div>
    );
  }

  // Render End Node
  if (currentNode?.type === 'end') {
    return (
      <motion.div 
        className="funnel-player w-full max-w-[400px] h-full max-h-[711px] bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0a] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col items-center justify-center p-8 text-center"
        style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.3s ease' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {currentNode.data.title || 'Vielen Dank!'}
        </h2>
        <p className="text-white/70 max-w-[280px]">
          {currentNode.data.message || 'Sie haben den Funnel erfolgreich abgeschlossen.'}
        </p>
      </motion.div>
    );
  }

  return null;
};
