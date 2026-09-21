'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { loginUser, clearAuthError } from '@/lib/features/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Loader2,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error, token } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setValidationError('Please enter both your email and password.');
      return;
    }

    const resultAction = await dispatch(loginUser({ email: trimmedEmail, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      router.push('/dashboard');
    }
  };

  const handleFillDemo = () => {
    setEmail('test@example.com');
    setPassword('123456');
    setValidationError(null);
    if (error) dispatch(clearAuthError());
  };

  const isLoading = status === 'loading';
  const displayedError = validationError || error;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sign in to Eyego
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Access enterprise orders, live visualizations, and reports
          </p>
        </div>

        <Card className="shadow-xl border-border/80 bg-card/95 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-semibold">Account Credentials</CardTitle>
            <CardDescription className="text-xs">
              Enter your authorized credentials to proceed
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {displayedError && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive flex items-center gap-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  <span>{displayedError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="test@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (displayedError) {
                        setValidationError(null);
                        dispatch(clearAuthError());
                      }
                    }}
                    className="pl-9 h-10 text-sm bg-background/60"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (displayedError) {
                        setValidationError(null);
                        dispatch(clearAuthError());
                      }
                    }}
                    className="pl-9 pr-10 h-10 text-sm bg-background/60"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/40 p-3 text-xs space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Demo Evaluation Access</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleFillDemo}
                    className="h-6 px-2 text-[11px] font-medium bg-card hover:bg-muted"
                  >
                    Auto-fill
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                  <div>
                    <span className="opacity-75">Email: </span>
                    <span className="font-mono text-foreground">test@example.com</span>
                  </div>
                  <div>
                    <span className="opacity-75">Password: </span>
                    <span className="font-mono text-foreground">123456</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 text-sm font-medium shadow-md shadow-primary/20 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
