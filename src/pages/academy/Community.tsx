import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, MessageSquare, ThumbsUp, Filter, Clock, TrendingUp, 
  User, ArrowLeft, Send, X, Loader2, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { communityService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface Post {
  id: string;
  title: string;
  content: string;
  post_type: string | null;
  upvotes: number | null;
  created_at: string | null;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Comment {
  id: string;
  content: string;
  upvotes: number | null;
  created_at: string | null;
  author: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

type FilterType = 'new' | 'popular' | 'mine';

export default function Community() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('new');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // New post form
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // New comment
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Check tier access
  const hasAccess = profile?.tier === 'academy' || profile?.tier === 'elite';

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await communityService.getPosts(50, 0);
      let filteredPosts = data as Post[];
      
      if (filter === 'popular') {
        filteredPosts = [...filteredPosts].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      } else if (filter === 'mine' && user) {
        // This would need to filter by user_id, but we don't have it in the response
        // For now, keep all posts
      }
      
      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return;
    
    try {
      setSubmitting(true);
      await communityService.createPost(user.id, newPostTitle, newPostContent, 'discussion');
      toast({
        title: 'Post erstellt',
        description: 'Dein Beitrag wurde erfolgreich veröffentlicht.',
      });
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
      loadPosts();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Post konnte nicht erstellt werden.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    setLoadingComments(true);
    
    try {
      const data = await communityService.getPostWithComments(post.id);
      setComments((data.comments || []) as Comment[]);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      await communityService.addComment(user.id, selectedPost.id, newComment);
      setNewComment('');
      
      // Reload comments
      const data = await communityService.getPostWithComments(selectedPost.id);
      setComments((data.comments || []) as Comment[]);
      
      toast({
        title: 'Kommentar hinzugefügt',
        description: 'Dein Kommentar wurde veröffentlicht.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Kommentar konnte nicht hinzugefügt werden.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: de });
  };

  // Access denied for Starter users
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
            <Link to="/academy/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </Link>
            <h1 className="font-bold text-lg">Community</h1>
          </div>
        </header>
        
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Community nur für Academy & Elite</h2>
          <p className="text-muted-foreground mb-8">
            Die Community ist exklusiv für Academy und Elite Mitglieder zugänglich. 
            Upgrade deinen Plan, um an Diskussionen teilzunehmen.
          </p>
          <Link to="/academy/pricing">
            <Button className="gap-2">
              Upgrade auf Academy
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/academy/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Link>
            <h1 className="font-bold text-lg">Community</h1>
          </div>
          
          <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Neuer Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Neuen Beitrag erstellen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Input
                    placeholder="Titel deines Beitrags"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Was möchtest du teilen?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="h-32"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowNewPost(false)}>
                    Abbrechen
                  </Button>
                  <Button 
                    onClick={handleCreatePost} 
                    disabled={submitting || !newPostTitle.trim() || !newPostContent.trim()}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Veröffentlichen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'new', label: 'Neu', icon: Clock },
            { id: 'popular', label: 'Beliebt', icon: TrendingUp },
            { id: 'mine', label: 'Meine Posts', icon: User },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Button
                key={f.id}
                variant={filter === f.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f.id as FilterType)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </Button>
            );
          })}
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Noch keine Beiträge vorhanden.</p>
            <p className="text-sm text-muted-foreground">Sei der Erste und erstelle einen Post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectPost(post)}
                className="glass rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author?.avatar_url || undefined} />
                    <AvatarFallback>
                      {post.author?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.author?.full_name || 'Unbekannt'}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                        <ThumbsUp className="w-4 h-4" />
                        {post.upvotes || 0}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                        <MessageSquare className="w-4 h-4" />
                        Kommentieren
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-4 sm:inset-10 bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold">Beitrag</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedPost(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-6">
                {/* Post Content */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={selectedPost.author?.avatar_url || undefined} />
                      <AvatarFallback>
                        {selectedPost.author?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedPost.author?.full_name || 'Unbekannt'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedPost.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <h1 className="text-2xl font-bold mb-4">{selectedPost.title}</h1>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedPost.content}</p>
                  
                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <ThumbsUp className="w-5 h-5" />
                      {selectedPost.upvotes || 0} Likes
                    </button>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h3 className="font-bold mb-4">Kommentare ({comments.length})</h3>
                  
                  {loadingComments ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Noch keine Kommentare. Schreibe den ersten!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author?.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {comment.author?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.author?.full_name || 'Unbekannt'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Comment Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Schreibe einen Kommentar..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                  />
                  <Button 
                    onClick={handleAddComment} 
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
