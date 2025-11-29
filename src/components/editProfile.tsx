import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser, type User } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import UserCard from "./userCard";

const EditProfile = ({ user }: { user: User }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || 0);
  const [gender, setGender] = useState(user.gender || "male");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [about, setAbout] = useState(user.about || "");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState(user.skills || []);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAge(user.age || 0);
    setGender(user.gender || "male");
    setPhotoUrl(user.photoUrl || "");
    setAbout(user.about || "");
    setSkills(user.skills || []);
  }, [user]);

  const handleSaveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          gender,
          photoUrl,
          about,
          skills,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => {
        console.log("Hiding toast");
        setShowToast(false);
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data || "Something went wrong");
      } else if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const handleAddSkill = () => {
    if (skill.length && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };
  return (
    <>
      <div className="flex justify-center my-16 gap-3">
        <div className="card bg-base-300 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>
            <div className="flex flex-col">
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Age</span>
                </div>
                <input
                  type="number"
                  value={age}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setAge(e.target.valueAsNumber)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-2 flex flex-col">
                <div className="label">
                  <span className="label-text">Gender</span>
                </div>
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn w-full justify-between"
                  >
                    {gender}
                    <i className="fa-solid fa-angle-down" />
                  </div>
                  <ul
                    tabIndex={-1}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 mt-1 shadow-sm"
                  >
                    <li className={gender === "male" ? "bg-base-300" : ""}>
                      <a onClick={() => setGender("male")}>Male</a>
                    </li>
                    <li className={gender === "female" ? "bg-base-300" : ""}>
                      <a onClick={() => setGender("female")}>Female</a>
                    </li>
                    <li className={gender === "others" ? "bg-base-300" : ""}>
                      <a onClick={() => setGender("others")}>Others</a>
                    </li>
                  </ul>
                </div>
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Photo URL</span>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">About</span>
                </div>
                <textarea
                  value={about}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Skills</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={skill}
                    className="input input-bordered max-w-xs flex-1"
                    onChange={(e) => setSkill(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleAddSkill}>
                    Add
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill, index) => {
                    return (
                      <span key={index} className="badge badge-soft">
                        {skill}
                        <i
                          className="fa-solid fa-circle-xmark text-white"
                          onClick={() => handleRemoveSkill(index)}
                        ></i>
                      </span>
                    );
                  })}
                </div>
              </label>
            </div>
            <p className="text-red-500">{error}</p>
            <div className="card-actions justify-center m-2">
              <button className="btn btn-primary" onClick={handleSaveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
        <UserCard
          user={{
            firstName,
            lastName,
            age,
            gender,
            photoUrl,
            about,
            skills,
          }}
          isProfileOverview={true}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center z-30">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;
