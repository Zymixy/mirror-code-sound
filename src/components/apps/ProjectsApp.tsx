import { ShoppingCart, Monitor, Keyboard, Radio, ExternalLink, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  demoUrl?: string;
  downloadUrl?: string;
  downloadFiles?: string[];
}

const projects: Project[] = [
  {
    id: 1,
    name: "CS2Store",
    description: "A digital marketplace for gaming products, featuring secure transactions and a seamless shopping experience for CS2 enthusiasts.",
    icon: ShoppingCart,
    demoUrl: "https://cs2store.netlify.app/",
  },
  {
    id: 2,
    name: "System Info Dashboard",
    description: "A comprehensive panel for monitoring system information, displaying real-time hardware metrics and performance data.",
    icon: Monitor,
    downloadFiles: ["/downloads/info.bat", "/downloads/sistema_info.ps1"],
  },
  {
    id: 3,
    name: "Keystroke Analyzer",
    description: "An educational tool designed to study typing patterns, helping users understand and improve their keyboard efficiency.",
    icon: Keyboard,
    downloadUrl: "/downloads/keystroke-analyzer.py",
  },
  {
    id: 4,
    name: "Remote Monitoring Tool",
    description: "Software built for remote administration in authorized environments, enabling efficient system management.",
    icon: Radio,
    downloadUrl: "/downloads/remote.py",
  },
];

export function ProjectsApp() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Projects</h1>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-default"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                <project.icon className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-background/50 rounded-lg text-xs hover:bg-background hover:scale-105 transition-all duration-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Demo
                    </a>
                  )}
                  {project.downloadUrl && (
                    <a
                      href={project.downloadUrl}
                      download
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-background/50 rounded-lg text-xs hover:bg-background hover:scale-105 transition-all duration-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  )}
                  {project.downloadFiles && project.downloadFiles.map((file, index) => (
                    <a
                      key={index}
                      href={file}
                      download
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-background/50 rounded-lg text-xs hover:bg-background hover:scale-105 transition-all duration-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {file.split('/').pop()}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
