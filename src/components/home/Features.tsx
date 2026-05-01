"use client";
import { Download, Edit, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import Title from "./Title";

export default function Features() {
    const [isHover, setIsHover] = useState(false);

    return (
        <div id="features" className="flex flex-col items-center my-10">
            {/* Badge */}
            <div className="flex items-center gap-2 text-sm text-primary bg-green-400/10 dark:border-green-400  border border-green-200 rounded-full px-4 py-1">
                <Zap className="stroke-green-600 h-4 w-4" />
                <span>Build smarter with AI</span>
            </div>

            {/* Title */}
            <Title
                title={"Create your perfect resume"}
                description={
                    "Our AI-powered platform helps you craft, optimize, and design professional resumes that stand out — all in just a few minutes."
                }
            />

            {/* Features */}
            <div className="flex flex-col md:flex-row items-center justify-center">
                <img
                    className="max-w-2xl w-full xl:-ml-32"
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
                    alt=""
                />

                <div
                    className="px-4 md:px-0"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    {/* Feature 1 */}
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div
                            className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300 
                                dark:group-hover:border-violet-700 dark:group-hover:bg-violet-300 flex gap-4 rounded-xl transition-colors ${
                                !isHover ? "border-violet-300 dark:border-violet-400 dark:bg-violet-300 bg-violet-100 " : ""
                            }`}
                        >
                            <Sparkles className="stroke-violet-400" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-foreground">
                                    AI Content Generation
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Generate professional summaries, bullet points, and skills tailored to your role.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 dark:group-hover:border-green-700 dark:group-hover:bg-green-300 flex gap-4 rounded-xl transition-colors">
                            <Edit className="stroke-green-400" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-foreground">
                                    Easy Customization
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Edit sections, reorder content, and personalize your resume with intuitive controls.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 dark:group-hover:border-orange-700 dark:group-hover:bg-orange-300 flex gap-4 rounded-xl transition-colors">
                            <Download className="stroke-orange-500" />
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-foreground">
                                    Instant PDF Download
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Download high-quality, ATS-friendly resumes ready to share with recruiters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}