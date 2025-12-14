import { User, MapPin, Calendar } from "lucide-react";

export function AboutApp() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">About Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Info cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Age</div>
              <div className="font-medium">¿? years old</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Country</div>
              <div className="font-medium">Spain</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Status</div>
              <div className="font-medium">Always Learning</div>
            </div>
          </div>
        </div>

        {/* Right column - Bio */}
        <div className="p-4 bg-secondary/50 rounded-xl">
          <p className="text-muted-foreground leading-relaxed">
            I'm a passionate developer focused on creating efficient software solutions and digital tools.
            With experience in building applications ranging from gaming platforms to system utilities,
            I enjoy tackling complex problems and turning ideas into functional products.
            Always learning, always building.
          </p>
        </div>
      </div>
    </div>
  );
}
