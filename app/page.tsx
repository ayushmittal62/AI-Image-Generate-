"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      }); 
      return;
    }

    try {
      setLoading(true);
      setImage(null); // Reset image before loading a new one

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging log

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(data.imageUrl);
    } catch (error: any) {
      console.error("Image Generation Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">AI Image Generator</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into stunning images using artificial intelligence.
            Simply describe what you want to see, and watch as AI brings your vision to life.
          </p>
        </div>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button
                onClick={generateImage}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Generating..." : <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate
                </>}
              </Button>
            </div>

            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}

            {image && !loading && (
              <div className="mt-6 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt="Generated AI Image"
                  className="w-full h-auto"
                  onError={() => console.error("Failed to load image:", image)}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
