import Google from "../assets/google.svg";
import Facebook from "../assets/fb.svg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Logo from "@/components/custom/logo";
import { useState } from "react";
import { signInWithOAuth } from "@/services/auth";
import { toast } from "sonner";

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleOAuthLogin = async (provider: "google" | "facebook") => {
        setIsLoading(true);
        try {
            await signInWithOAuth(provider);
        } catch (err) {
            toast(`Failed to sign in with ${provider}. Please try again.`)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <Logo/>
                    <h1 className="text-2xl font-bold mt-4">MeetSpace</h1>
                    <p className="mt-1 text-muted-foreground">Connect, collaborate, communicate</p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Welcome</CardTitle>
                        <CardDescription className="text-center">Sign in to join your meetings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 h-11"
                                onClick={() => handleOAuthLogin("google")}
                                disabled={isLoading}
                            >
                                <img src={Google} alt="google" className="h-5 w-5" />
                                Continue with Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 h-11"
                                onClick={() => handleOAuthLogin("facebook")}
                                disabled={isLoading}
                            >
                                <img src={Facebook} alt="facebook" className="h-5 w-5" />
                                Continue with Facebook
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            <p>
                                Don't have an account?{" "}
                                <Button variant="link" className="px-1 text-sm h-auto">
                                    Contact your administrator
                                </Button>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <p className="text-xs text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <Button variant="link" className="px-0 text-xs h-auto">
                            Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="px-0 text-xs h-auto">
                            Privacy Policy
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    )
}
