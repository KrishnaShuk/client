// client/components/ui/UserAuth.tsx
'use client';
import { useUser, UserButton } from '@clerk/nextjs';

interface UserAuthProps {
  isOpen: boolean;
}

const UserAuth = ({ isOpen }: UserAuthProps) => {
  const { user } = useUser();

  return (
    <div className="p-2 mt-auto flex items-center gap-3 border-t border-border">
      <UserButton afterSignOutUrl="/" />
      {isOpen && (
        <span className="truncate text-sm text-muted-foreground">
          {user?.primaryEmailAddress?.emailAddress}
        </span>
      )}
    </div>
  );
};

export default UserAuth;