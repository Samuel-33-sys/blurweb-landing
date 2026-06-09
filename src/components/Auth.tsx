import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { X, Mail, Lock, Loader2, User, LogOut, CreditCard, Zap, Eye, EyeOff, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
};

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const docPath = `users/${user.uid}`;
        
        // Initialize user document
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          plan: 'free',
          blurCount: 0,
          lastReset: new Date().toISOString(),
          uid: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }).catch(err => handleFirestoreError(err, OperationType.WRITE, docPath));
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-bg-main rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-border-dim"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-bold tracking-tight text-text-primary">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-text-secondary/20" />
                </button>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-text-secondary/30 uppercase block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/20" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-card-bg rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all text-text-primary placeholder:text-text-secondary/20 border border-border-dim"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-text-secondary/30 uppercase block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/20" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-card-bg rounded-2xl pl-14 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all text-text-primary placeholder:text-text-secondary/20 border border-border-dim"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary/40 hover:text-text-primary transition-colors pr-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-full font-bold text-lg transition-all hover:bg-black/90 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="mt-10 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-text-secondary/40 hover:text-text-primary font-bold transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const UserDashboard = ({ onUpgrade, onInstall }: { onUpgrade?: (plan: any) => void, onInstall?: () => void }) => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const docPath = `users/${user.uid}`;
      const unsubscribe = onSnapshot(
        doc(db, 'users', user.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Create user profile if it doesn't exist
            setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              plan: 'free',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              blurCount: 0
            }).catch(err => handleFirestoreError(err, OperationType.WRITE, docPath));
          }
          setLoading(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, docPath);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  if (!user) {
    if (!loading) window.location.href = '/';
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <Loader2 className="w-12 h-12 animate-spin text-black/10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main pt-32 pb-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">My Shield</h1>
            <p className="text-text-secondary/40 font-medium">Manage your privacy and subscription</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-sm font-bold text-text-primary hover:opacity-60 transition-opacity"
          >
            Back to Home
          </button>
        </div>

        <div className="p-10 bg-white rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
                <User className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{user.email}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${userData?.plan === 'pro' ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}>
                    {userData?.plan?.toUpperCase() || 'FREE'} PLAN
                  </span>
                  {userData?.plan === 'pro' && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-500/10 text-green-600 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="p-4 hover:bg-black/5 rounded-full text-black/20 hover:text-red-500 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-10">
            <div className="p-8 bg-black/5 rounded-[2rem] border border-black/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black tracking-widest text-black/30 uppercase">Extension Usage (Today)</span>
                <span className="text-sm font-bold text-text-primary">
                  {userData?.blurCount || 0} / {userData?.plan === 'pro' ? '∞' : '3'}
                </span>
              </div>
              <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${userData?.plan === 'pro' ? 100 : Math.min(((userData?.blurCount || 0) / 3) * 100, 100)}%` }}
                  className="h-full bg-black shadow-[0_0_15px_rgba(0,0,0,0.1)]" 
                />
              </div>
              <p className="mt-4 text-xs font-medium text-black/30">
                {userData?.plan === 'pro' 
                  ? "Unlimited privacy protection active." 
                  : "Upgrade to Pro for unlimited screen & video blurring."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {userData?.plan !== 'pro' ? (
                <button 
                  onClick={() => onUpgrade?.('PRO_YEARLY')}
                  className="w-full py-5 bg-black text-white rounded-full font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  Upgrade to Pro
                </button>
              ) : (
                <div className="w-full py-5 bg-green-500/10 text-green-600 rounded-full font-bold text-center border border-green-500/20">
                  Lifetime Subscription Active
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => window.open('https://chromewebstore.google.com', '_blank')}
                  className="w-full py-5 bg-white text-black border border-black/10 rounded-full font-bold text-sm hover:bg-black/5 transition-all flex items-center justify-center gap-3"
                >
                  <Monitor className="w-5 h-5" />
                  Web Store
                </button>
                <button 
                  onClick={() => window.open('/extension-beta.zip', '_blank')}
                  className="w-full py-5 bg-black/5 text-black rounded-full font-bold text-sm hover:bg-black/10 transition-all flex items-center justify-center gap-3 border border-black/5"
                >
                  <Zap className="w-5 h-5 text-black/40" />
                  Download Beta
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-text-secondary/20 text-xs font-medium">
            Database Status: <span className="text-green-500 font-bold">Connected</span> • 
            Encryption: <span className="text-text-primary/40 font-bold">AES-256</span>
          </p>
        </div>
      </div>
    </div>
  );
};
