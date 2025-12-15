import { useState, useRef, useEffect } from "react";

const fileSystem: Record<string, string[]> = {
  "/": ["home", "usr", "etc", "var", "bin", "tmp"],
  "/home": ["zymixy"],
  "/home/zymixy": ["projects", "documents", "readme.txt", ".secret", "notes.txt"],
  "/home/zymixy/projects": ["cs2store", "dashboard", "keylogger", "virus.exe"],
  "/home/zymixy/documents": ["resume.pdf", "passwords.txt"],
  "/usr": ["bin", "lib"],
  "/usr/bin": ["ls", "cd", "cat", "pwd", "echo"],
  "/etc": ["config", "hosts", "passwd"],
  "/var": ["log"],
  "/var/log": ["system.log", "error.log"],
  "/bin": ["bash", "zsh", "sh"],
  "/tmp": ["cache"],
};

const fileContents: Record<string, string> = {
  "/home/zymixy/readme.txt": "Welcome to Zymixy's portfolio!\n\nType 'help' to see available commands.\nExplore the filesystem to discover secrets!",
  "/home/zymixy/.secret": "🎉 You found the secret file!\n\nHere's a cookie: 🍪\n\nContact: zymixy@portfolio.dev",
  "/home/zymixy/notes.txt": "TODO:\n- Finish portfolio\n- Learn more React\n- Touch grass",
  "/home/zymixy/documents/passwords.txt": "Nice try! All passwords are hashed with bcrypt 😎",
  "/home/zymixy/projects/virus.exe": "#!/bin/bash\necho 'Just kidding, this is harmless!'\nexit 0",
  "/etc/hosts": "127.0.0.1    localhost\n::1          localhost\n192.168.1.1  router",
  "/etc/passwd": "zymixy:x:1000:1000:Zymixy:/home/zymixy:/bin/bash\nroot:x:0:0:root:/root:/bin/bash",
  "/var/log/system.log": "[2024-01-15 10:00:00] System started\n[2024-01-15 10:00:01] All services running\n[2024-01-15 10:00:02] Portfolio loaded successfully",
  "/var/log/error.log": "No errors found. System running smoothly!",
};

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
  "Programming is not about typing, it's about thinking. - Rich Hickey",
];

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "Why do Java developers wear glasses? Because they can't C#!",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
];

export function TerminalApp() {
  const [lines, setLines] = useState<string[]>([
    "╔══════════════════════════════════════════╗",
    "║     Zymixy Terminal v3.0 - ZymOS         ║",
    "║     Type 'help' for available commands   ║",
    "╚══════════════════════════════════════════╝",
    "",
  ]);
  const [input, setInput] = useState("");
  const [currentDir, setCurrentDir] = useState("/home/zymixy");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [user] = useState("zymixy");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const addOutput = (output: string[]) => {
    setLines((prev) => [...prev, ...output, ""]);
  };

  const getPrompt = () => `${user}@zym:${currentDir}$`;

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd]);
    }
    setHistoryIndex(-1);

    switch (command) {
      case "help":
        addOutput([
          "┌─────────────────────────────────────────┐",
          "│          AVAILABLE COMMANDS             │",
          "├─────────────────────────────────────────┤",
          "│  help          Show this help message   │",
          "│  clear         Clear the terminal       │",
          "│  ls            List directory contents  │",
          "│  cd <dir>      Change directory         │",
          "│  pwd           Print working directory  │",
          "│  cat <file>    Display file contents    │",
          "│  whoami        Display current user     │",
          "│  date          Display date and time    │",
          "│  echo <text>   Print text to terminal   │",
          "│  neofetch      Display system info      │",
          "│  history       Show command history     │",
          "│  uname         System information       │",
          "│  fortune       Random quote             │",
          "│  joke          Random programming joke  │",
          "│  cowsay <msg>  Cow says message         │",
          "│  tree          Show directory tree      │",
          "│  calc <expr>   Simple calculator        │",
          "│  ping <host>   Ping a host              │",
          "│  matrix        Enter the matrix         │",
          "│  weather       Show weather             │",
          "│  banner <txt>  ASCII art banner         │",
          "└─────────────────────────────────────────┘",
        ]);
        break;

      case "clear":
        setLines([]);
        return;

      case "ls":
        const showHidden = args.includes("-a") || args.includes("-la");
        const dir = currentDir === "/" ? "/" : currentDir;
        const contents = fileSystem[dir];
        if (contents) {
          const filtered = showHidden ? contents : contents.filter(f => !f.startsWith("."));
          if (args.includes("-l") || args.includes("-la")) {
            addOutput(filtered.map(f => {
              const isDir = fileSystem[`${dir === "/" ? "" : dir}/${f}`] !== undefined;
              return `${isDir ? "drwxr-xr-x" : "-rw-r--r--"}  ${user}  ${isDir ? "4096" : "1024"}  ${f}`;
            }));
          } else {
            addOutput([filtered.join("  ")]);
          }
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
        } else if (args[0].startsWith("/")) {
          if (fileSystem[args[0]]) {
            setCurrentDir(args[0]);
            addOutput([]);
          } else {
            addOutput([`cd: ${args[0]}: No such directory`]);
          }
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
          const filePath = args[0].startsWith("/") ? args[0] : `${currentDir}/${args[0]}`;
          if (fileContents[filePath]) {
            addOutput(fileContents[filePath].split("\n"));
          } else {
            addOutput([`cat: ${args[0]}: No such file`]);
          }
        }
        break;

      case "whoami":
        addOutput([user]);
        break;

      case "date":
        addOutput([new Date().toLocaleString("en-US", { 
          weekday: "long", year: "numeric", month: "long", 
          day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
        })]);
        break;

      case "echo":
        addOutput([args.join(" ")]);
        break;

      case "neofetch":
        addOutput([
          "         ████████           zymixy@portfolio",
          "       ██        ██         ─────────────────",
          "      ██  ██  ██  ██        OS: ZymOS 3.0",
          "     ██    ████    ██       Host: Portfolio Desktop",
          "     ██            ██       Kernel: React 18.3",
          "      ██  ▄▄▄▄▄▄  ██        Shell: ZymTerminal",
          "       ██        ██         Resolution: 1920x1080",
          "         ████████           Theme: Neon Dark",
          "                            CPU: JavaScript V8",
          "                            Memory: 8GB / 16GB",
        ]);
        break;

      case "history":
        if (commandHistory.length === 0) {
          addOutput(["No commands in history"]);
        } else {
          addOutput(commandHistory.map((c, i) => `  ${(i + 1).toString().padStart(3)}  ${c}`));
        }
        break;

      case "uname":
        if (args.includes("-a")) {
          addOutput(["ZymOS 3.0.0 Portfolio x86_64 React/TypeScript/Vite"]);
        } else if (args.includes("-r")) {
          addOutput(["3.0.0"]);
        } else {
          addOutput(["ZymOS"]);
        }
        break;

      case "fortune":
        addOutput([quotes[Math.floor(Math.random() * quotes.length)]]);
        break;

      case "joke":
        addOutput([jokes[Math.floor(Math.random() * jokes.length)]]);
        break;

      case "cowsay":
        const message = args.join(" ") || "Moo!";
        const border = "─".repeat(message.length + 2);
        addOutput([
          ` ┌${border}┐`,
          ` │ ${message} │`,
          ` └${border}┘`,
          "        \\   ^__^",
          "         \\  (oo)\\_______",
          "            (__)\\       )\\/\\",
          "                ||----w |",
          "                ||     ||",
        ]);
        break;

      case "tree":
        const showTree = (path: string, prefix: string = ""): string[] => {
          const items = fileSystem[path];
          if (!items) return [];
          const result: string[] = [];
          items.forEach((item, i) => {
            const isLast = i === items.length - 1;
            const connector = isLast ? "└── " : "├── ";
            const isDir = fileSystem[`${path === "/" ? "" : path}/${item}`] !== undefined;
            result.push(`${prefix}${connector}${isDir ? `📁 ${item}` : `📄 ${item}`}`);
          });
          return result;
        };
        addOutput([currentDir, ...showTree(currentDir)]);
        break;

      case "calc":
        try {
          const expr = args.join("").replace(/[^0-9+\-*/().]/g, "");
          if (expr) {
            const result = Function(`"use strict"; return (${expr})`)();
            addOutput([`= ${result}`]);
          } else {
            addOutput(["Usage: calc <expression>", "Example: calc 2+2*3"]);
          }
        } catch {
          addOutput(["Error: Invalid expression"]);
        }
        break;

      case "ping":
        if (!args[0]) {
          addOutput(["Usage: ping <host>"]);
        } else {
          const host = args[0];
          addOutput([
            `PING ${host} (127.0.0.1): 56 data bytes`,
            `64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=${(Math.random() * 10).toFixed(3)} ms`,
            `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=${(Math.random() * 10).toFixed(3)} ms`,
            `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=${(Math.random() * 10).toFixed(3)} ms`,
            `--- ${host} ping statistics ---`,
            `3 packets transmitted, 3 received, 0% packet loss`,
          ]);
        }
        break;

      case "matrix":
        addOutput([
          "Wake up, Neo...",
          "The Matrix has you...",
          "Follow the white rabbit.",
          "",
          "01001000 01100101 01101100 01101100 01101111",
        ]);
        break;

      case "weather":
        addOutput([
          "┌──────────────────────────────────┐",
          "│  🌤️  Weather in Matrix City       │",
          "├──────────────────────────────────┤",
          "│  Temperature: 22°C (72°F)        │",
          "│  Condition: Partly Cloudy        │",
          "│  Humidity: 45%                   │",
          "│  Wind: 12 km/h NW                │",
          "└──────────────────────────────────┘",
        ]);
        break;

      case "banner":
        const text = args.join(" ").toUpperCase() || "HELLO";
        const chars: Record<string, string[]> = {
          "DEFAULT": [
            "█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█",
            "█  " + text.padEnd(18) + "  █",
            "█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█",
          ],
        };
        addOutput(chars["DEFAULT"]);
        break;

      case "sudo":
        addOutput(["Nice try! But you don't have sudo privileges here 😉"]);
        break;

      case "rm":
        if (args.includes("-rf") && (args.includes("/") || args.includes("*"))) {
          addOutput(["Nice try! 🚫 System protected against destruction."]);
        } else {
          addOutput([`rm: cannot remove '${args[0] || ""}': Permission denied`]);
        }
        break;

      case "exit":
        addOutput(["Goodbye! (but you can't really exit this terminal 😄)"]);
        break;

      case "":
        addOutput([]);
        break;

      default:
        addOutput([`zsh: command not found: ${command}`, "Type 'help' for available commands"]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLines((prev) => [...prev, `${getPrompt()} ${input}`]);
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
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple autocomplete for commands
      const commands = ["help", "clear", "ls", "cd", "pwd", "cat", "whoami", "date", "echo", "neofetch", "history", "uname", "fortune", "joke", "cowsay", "tree", "calc", "ping", "matrix", "weather", "banner"];
      const match = commands.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <div 
      className="h-full bg-black/95 text-green-400 font-mono text-sm p-4 overflow-auto custom-scrollbar"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-relaxed">{line}</div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-cyan-400 font-bold">{getPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 ml-2 bg-transparent outline-none text-green-300 caret-green-400"
          autoFocus
          spellCheck={false}
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
