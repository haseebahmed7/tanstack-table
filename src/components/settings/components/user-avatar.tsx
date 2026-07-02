import {
  Avatar as AvatarUI,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface AvatarProps {
  name?: string;
  src?: string;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  alt,
  className = "h-10 w-10 border",
}) => {
  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <AvatarUI className={className}>
      <AvatarImage src={src} alt={alt ?? name ?? "Avatar"} />
      {name && (
        <AvatarFallback className="bg-blue-100 text-blue-800">
          {getInitials(name)}
        </AvatarFallback>
      )}
    </AvatarUI>
  );
};
