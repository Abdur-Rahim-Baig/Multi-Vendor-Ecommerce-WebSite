import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="p-8">
      <div className="flex flex-col gap-y-5">
        <div>
          <Button variant="elevated">
            Iam a Button
          </Button>
        </div>
        <div>
          <Input placeholder="Iam a input"/>
        </div>
        <div>
          <Progress value={5}/>
        </div>
        <div>
          <Textarea placeholder="Iam a textarea"/>
        </div>
        <div>
          <Checkbox/>
        </div>
      </div>
    </div>
  );
}
