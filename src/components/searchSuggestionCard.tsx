import type { User } from "../utils/userSlice";

type Props = {
  user: User;
  onSelect: (user: User) => void;
};

function SearchSuggestionCard({ user, onSelect }: Props) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-2xl border border-base-300 bg-base-200 p-4 text-left transition-all duration-200 hover:border-primary hover:bg-base-300"
      onClick={() => onSelect(user)}
    >
      <img
        src={
          user.photoUrl ??
          "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
        }
        alt={`${user.firstName} ${user.lastName}`}
        className="h-14 w-14 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-base font-semibold capitalize">
            {user.firstName} {user.lastName}
          </p>
          {user.relationStatus === "accepted" && (
            <span className="badge badge-primary badge-outline">Connected</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.slice(0, 3).map((skill, index) => (
              <span key={`${skill}-${index}`} className="badge badge-soft capitalize">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm opacity-70">No skills added yet</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default SearchSuggestionCard;
