import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserApps } from "@/actions/user-apps";
import { AppCard } from "./app-card";

export function UserApps() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["userApps"],
    queryFn: getUserApps,
    initialData: [],
  });

  const onAppDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["userApps"] });
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-logo-cream/80 text-lg sm:text-xl font-medium leading-relaxed">
          No apps created yet. Start building your first app above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-logo-gradient text-center leading-tight">
        Your Apps
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((app) => (
          <AppCard 
            key={app.id}
            id={app.id}
            name={app.name}
            createdAt={app.createdAt}
            onDelete={onAppDeleted}
          />
        ))}
      </div>
    </div>
  );
}
