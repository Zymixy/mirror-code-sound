import { useState, useRef, useEffect } from "react";

const fileSystem: Record<string, string[]> = {
  "/": ["home", "usr", "etc", "var"],
  "/home": ["zymixy"],
  "/home/zymixy": ["projects", "documents", "readme.txt"],
  "/home/zymixy/projects": ["cs2store", "dashboard", "keylogger"],
  "/usr": ["bin", "lib"],
  "/etc": ["config"],
  "/var": ["log"],
};

const fileContents: Record<string, string> = {
  "/home/zymixy/readme.txt": "Welcome to Zymixy's portfolio!\n\nType 'help' to see available commands.",
};

export function TerminalApp() {
  const [lines, setLines] = useState<string[]>([
    "Zymixy Terminal v2.0",
    "Type 'help' for available commands",
    "",
  ]);
  const [input, setInput] = useState("");
  const [currentDir, setCurrentDir] = useState("/home/zymixy");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const addOutput = (output: string[]) => {
    setLines((prev) => [...prev, ...output, ""]);
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    switch (command) {
      case "help":
        addOutput([
          "Available commands:",
          "  help          - Show this help message",
          "  clear         - Clear the terminal",
          "  ls            - List directory contents",
          "  cd <dir>      - Change directory",
          "  pwd           - Print working directory",
          "  cat <file>    - Display file contents",
          "  whoami        - Display current user",
          "  date          - Display current date and time",
          "  echo <text>   - Print text to terminal",
          "  neofetch      - Display system info",
          "  history       - Show command history",
          "  uname         - System information",
          "  uptime        - System uptime",
        ]);
        break;

      case "clear":
        setLines([]);
        return;

      case "ls":
        const dir = currentDir === "/" ? "/" : currentDir;
        const contents = fileSystem[dir];
        if (contents) {
          addOutput([contents.join("  ")]);
        } else {
          addOutput(["ls: cannot access: No such directory"]);
        }
        break;

      case "cd":
        if (!args[0] || args[0] === "~") {
          setCurrentDir("/home/zymixy");
          addOutput([]);
        } else if (args[0] === "..") {
          const parent = currentDir.split("/").slice(0, -1).join("/") || "/";
          setCurrentDir(parent);
          addOutput([]);
        } else if (args[0] === "/") {
          setCurrentDir("/");
          addOutput([]);
        } else {
          const newPath = currentDir === "/" ? `/${args[0]}` : `${currentDir}/${args[0]}`;
          if (fileSystem[newPath]) {
            setCurrentDir(newPath);
            addOutput([]);
          } else {
            addOutput([`cd: ${args[0]}: No such directory`]);
          }
        }
        break;

      case "pwd":
        addOutput([currentDir]);
        break;

      case "cat":
        if (!args[0]) {
          addOutput(["cat: missing file operand"]);
        } else {
          const filePath = `${currentDir}/${args[0]}`;
          if (fileContents[filePath]) {
            addOutput(fileContents[filePath].split("\n"));
          } else {
            addOutput([`cat: ${args[0]}: No such file`]);
          }
        }
        break;

      case "whoami":
        addOutput(["zymixy"]);
        break;

      case "date":
        addOutput([new Date().toString()]);
        break;

      case "echo":
        addOutput([args.join(" ")]);
        break;

      case "neofetch":
        addOutput([
          "       _____       ",
          "      /     \\      zymixy@portfolio",
          "     /       \\     -----------------",
          "    |  Z   Y  |    OS: Zymixy OS",
          "    |         |    Host: Portfolio v2.0",
          "     \\_______/     Kernel: React 18.3",
          "                   Shell: ZymTerminal",
          "                   Theme: Dark Mode",
          "                   Terminal: Zymixy Terminal",
        ]);
        break;

      case "history":
        addOutput(commandHistory.map((c, i) => `  ${i + 1}  ${c}`));
        break;

      case "uname":
        if (args[0] === "-a") {
          addOutput(["ZymOS 2.0.0 Portfolio x86_64 React/TypeScript"]);
        } else {
          addOutput(["ZymOS"]);
        }
        break;

      case "uptime":
        addOutput(["up 99 days, 23:59, load average: 0.00, 0.01, 0.05"]);
        break;

      case "sudo":
        addOutput(["Nice try! But you don't have sudo privileges here 😉"]);
        break;

      case "rm":
        if (args.includes("-rf") && args.includes("/")) {
          addOutput(["Nice try! 🚫 System protected."]);
        } else {
          addOutput([`rm: cannot remove '${args[0] || ""}': Operation not permitted`]);
        }
        break;

      case "exit":
        addOutput(["Goodbye! (but you can't really exit this terminal 😄)"]);
        break;

      case "":
        addOutput([]);
        break;

      default:
        addOutput([`${command}: command not found`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLines((prev) => [...prev, `${currentDir} $ ${input}`]);
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-auto">
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      <form onSubmit={handleSubmit} className="flex">
        <span className="text-green-500">{currentDir} $</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 ml-2 bg-transparent outline-none"
          autoFocus
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
