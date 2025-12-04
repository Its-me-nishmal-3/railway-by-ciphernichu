import React from 'react';
import { 
  Train, 
  MapPin, 
  Clock, 
  Calendar, 
  Search, 
  Navigation, 
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Send,
  Bot
} from 'lucide-react';

export const TrainIcon = ({ className }: { className?: string }) => <Train className={className} />;
export const LocationIcon = ({ className }: { className?: string }) => <MapPin className={className} />;
export const ClockIcon = ({ className }: { className?: string }) => <Clock className={className} />;
export const CalendarIcon = ({ className }: { className?: string }) => <Calendar className={className} />;
export const SearchIcon = ({ className }: { className?: string }) => <Search className={className} />;
export const NavigationIcon = ({ className }: { className?: string }) => <Navigation className={className} />;
export const AlertIcon = ({ className }: { className?: string }) => <AlertCircle className={className} />;
export const CheckIcon = ({ className }: { className?: string }) => <CheckCircle2 className={className} />;
export const DotsIcon = ({ className }: { className?: string }) => <MoreVertical className={className} />;
export const ArrowRightIcon = ({ className }: { className?: string }) => <ArrowRight className={className} />;
export const SparklesIcon = ({ className }: { className?: string }) => <Sparkles className={className} />;
export const MessageSquareIcon = ({ className }: { className?: string }) => <MessageSquare className={className} />;
export const SendIcon = ({ className }: { className?: string }) => <Send className={className} />;
export const BotIcon = ({ className }: { className?: string }) => <Bot className={className} />;