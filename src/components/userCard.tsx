import type { User } from "../utils/userSlice";

type Props = {
  user: User;
  isProfileOverview?: boolean;
};

function UserCard({ user, isProfileOverview }: Props) {
  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure className="px-10 pt-10">
        <img
          src={
            user?.photoUrl ??
            "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
          }
          alt="User Photo"
          className="rounded-xl"
        />
      </figure>
      <div className="card-body flex gap-4">
        <div className="flex justify-center items-center text-center">
          <h2 className="card-title">
            {user.firstName} {user.lastName}
          </h2>
        </div>
        <div className="flex gap-4 flex-col">
          {user.about && <p>{user.about}</p>}
          {user.age && (
            <p>
              {user.age} years
              {user.gender && <span>, {user.gender}</span>}
            </p>
          )}
          {user.skills && user.skills.length > 0 && (
            <div className="badge-group flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span key={index} className="badge badge-soft">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        {!isProfileOverview && (
          <div className=" flex items-center text-center">
            <div className="flex card-actions items-center">
              <button className="btn btn-primary">Ignore</button>
              <button className="btn btn-secondary">Interested</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCard;
