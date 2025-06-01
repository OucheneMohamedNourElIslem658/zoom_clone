import Google from "../assets/google.svg";
import Facebook from "../assets/fb.svg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Logo from "@/components/custom/logo";

export default function AuthPage() {
    const handleOAuthLogin = (provider: string) => {
        console.log(`Logging in with ${provider}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 dark">
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
                            >
                                <img src={Google} alt="google" className="h-5 w-5" />
                                Continue with Google
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 h-11"
                                onClick={() => handleOAuthLogin("facebook")}
                            >
                                <img src={Facebook} alt="facebook" className="h-5 w-5" />
                                Continue with Facebook
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 h-11"
                                onClick={() => handleOAuthLogin("custom")}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                </svg>
                                Continue with Custom Provider
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
