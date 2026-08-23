import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Organisation defaults for the control panel
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            These fields are placeholders until settings are persisted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 max-w-md">
            <Label htmlFor="org">Organisation name</Label>
            <Input id="org" defaultValue="AlterStays" disabled />
          </div>
          <div className="grid gap-2 max-w-md">
            <Label htmlFor="support">Support email</Label>
            <Input id="support" defaultValue="support@alterstay.in" disabled />
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Currency, hold TTL, and payment environment stay in backend env vars
            for now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
