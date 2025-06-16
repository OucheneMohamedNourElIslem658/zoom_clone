import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, Users, Shield, Zap, Globe, MessageSquare, Monitor, Star, ArrowRight, Play } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: "HD Video Calls",
      description: "Crystal clear video quality with up to 4K resolution for professional meetings.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Up to 1000 Participants",
      description: "Host large meetings, webinars, and conferences with unlimited participants.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "Your conversations are secure with military-grade encryption technology.",
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Screen Sharing",
      description: "Share your screen, applications, or specific windows with ease.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time Chat",
      description: "Send messages, files, and emojis during your meetings.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Accessibility",
      description: "Join from anywhere in the world with our global server network.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "MeetSpace has transformed how our remote team collaborates. The video quality is exceptional!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "StartupXYZ",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "We switched from other platforms to MeetSpace. The reliability and features are unmatched.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Teacher",
      company: "Online Academy",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Perfect for online classes. Students love the interactive features and chat functionality.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Soon with AI-powered features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect, Collaborate,
            <br />
            <span className="text-primary">Create Together</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            MeetSpace brings teams together with crystal-clear video calls, seamless screen sharing, and powerful
            collaboration tools. Experience the future of remote communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
                <Button size="lg" className="gap-2">
                    Start Free Meeting
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2" onClick={() => window.open(import.meta.env.VITE_PREVIEW_URL)}>
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </div>
          <div className="mt-12">
            <div className="bg-muted rounded-lg p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold">10M+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">150+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4.9/5</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for seamless meetings</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make your virtual meetings more productive and engaging.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get started in seconds</h2>
            <p className="text-xl text-muted-foreground">No downloads, no complicated setup. Just click and connect.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create or Join</h3>
              <p className="text-muted-foreground">Start a new meeting or join with a simple meeting ID.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Invite Others</h3>
              <p className="text-muted-foreground">Share the meeting link via email, chat, or calendar.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Collaborating</h3>
              <p className="text-muted-foreground">Enjoy high-quality video calls with all the tools you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by teams worldwide</h2>
            <p className="text-xl text-muted-foreground">See what our users have to say about MeetSpace.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-8 px-4 border-t">
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MeetSpace. All rights reserved.</p>
          </div>
      </footer>
    </div>
  )
}
