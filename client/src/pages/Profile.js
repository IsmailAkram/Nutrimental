import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import UnisexAvatar from "../assets/profile_pic/UnisexAvatar.jpg";
import AccountLayout from "../components/AccountLayout";

import { Image } from "cloudinary-react"; // profile image

// "https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
const TABS = ["Account Information"];

const getDate = (date) => {
  return Date(date).split(" ").splice(1, 3).join(" ");
};

export default function Profile({ authProps, setAuthProps }) {
  const [selectedTab, setSelectedTab] = React.useState(TABS[0]);
  const [editingInfo, setEditingInfo] = React.useState(false);

  const [changedFirstName, setChangedFirstName] = React.useState("");
  const [changedLastName, setChangedLastName] = React.useState("");
  const [changedWeight, setChangedWeight] = React.useState("");
  const [changedHeight, setChangedHeight] = React.useState("");
  const [changedDiet, setChangedDiet] = React.useState("");

  const [imageSelected, setImageSelected] = React.useState("");
  const [profilePic, setProfilePic] = React.useState("");

  // initial render
  const getUser = async () => {
    await axios
      .get(`/api/user/get/?user_email=${authProps.user.user_email}`)
      .then((res) => {
        setProfilePic(res.data.image_url);
      });
  };

  React.useEffect(() => {
    if (authProps.user) {
      getUser();
    }
  }, [authProps]);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "rkb3oumh");

    await axios
      .post("https://api.cloudinary.com/v1_1/dvnalmvqo/image/upload", formData)
      .then((res) => {
        setProfilePic(res.data.url); // set State.
        putImageUserDB(res.data.url);
      })
      .catch((err) => {
        console.log("Error uploading user profile image to Cloudinary", err);
      });
  };

  const putImageUserDB = async (imageStr) => {
    await axios
      .put(`/api/user/put?user_email=${authProps.user.user_email}`, {
        image_url: imageStr,
      })
      .then((res) => {
        console.log("Successful profile image upload");
      })
      .catch((err) => {
        console.log("Error uploading profile image. ", err);
      });
  };

  const editButtonHandler = () => {
    setEditingInfo(!editingInfo);
  };
  const cancelButtonHandler = () => {
    setEditingInfo(false);
    clearFieldHandle();
  };

  const clearFieldHandle = () => {
    setChangedFirstName("");
    setChangedLastName("");
    setChangedWeight("");
    setChangedHeight("");
    setChangedDiet("");
  };

  const saveButtonHandler = () => {
    authProps.user.first_name =
      changedFirstName === "" ? authProps.user.first_name : changedFirstName;
    authProps.user.last_name =
      changedLastName === "" ? authProps.user.last_name : changedLastName;
    authProps.user.weight =
      changedWeight === "" ? authProps.user.weight : changedWeight;
    authProps.user.height =
      changedHeight === "" ? authProps.user.height : changedHeight;
    authProps.user.diet =
      changedDiet === "" ? authProps.user.diet : changedDiet;

    clearFieldHandle();

    const updateDBInfo = async (err) => {
      if (err) {
        toast.error(err.message);
      } else {
        await axios
          .put(`/api/user/put?user_email=${authProps.user.user_email}`, {
            first_name: authProps.user.first_name,
            last_name: authProps.user.last_name,
            weight: authProps.user.weight,
            height: authProps.user.height,
            diet: authProps.user.diet,
          })
          .then((res) => {
            toast.success("Successfully updated your profile");
          })
          .catch((err) => {
            toast.error(err.message);
          });
      }
    };

    updateDBInfo();
    setEditingInfo(false);
  };

  return (
    authProps.isAuthenticated &&
    authProps.session &&
    selectedTab === "Account Information" && (
      <AccountLayout
        tabsLst={TABS}
        handleTabUpdate={setSelectedTab}
        selectedTab={selectedTab}
      >
        <div className="container mx-auto p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            {/* <!-- Left Side --> */}
            <div className="w-full md:w-3/12 md:mx-2">
              {/* <!-- Profile Card --> */}
              <div className="bg-white p-3 border-t-4 border-green-400">
                <div className="image overflow-hidden">
                  <Image
                    className="h-auto w-full mx-auto"
                    src={profilePic === "" ? UnisexAvatar : profilePic}
                    alt=""
                    cloudName="rkb3oumh"
                    public_id={profilePic}
                  />
                  <input
                    type="file"
                    onChange={(e) => {
                      setImageSelected(e.target.files[0]);
                    }}
                  />
                  <button
                    onClick={() => {
                      if (authProps.user) {
                        uploadImage();
                      } else {
                        alert("Issue uploading image.");
                      }
                    }}
                  >
                    Upload Image
                  </button>
                </div>
                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                  {authProps.user.first_name} {authProps.user.last_name}
                </h1>

                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>Status</span>
                    <span className="ml-auto">
                      <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                        Active
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Member since</span>
                    <span className="ml-auto">
                      {getDate(authProps.user.signup_date.slice(0, 10))}
                    </span>
                  </li>
                </ul>
              </div>
              {/* <!-- End of profile card --> */}
              <div className="my-4"></div>
            </div>
            {/* <!-- Right Side --> */}
            <div className="w-full md:w-9/12 mx-2 h-64">
              {/* <!-- Profile tab --> */}
              {/* <!-- About Section --> */}
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">About</span>
                </div>
                <div className="text-gray-700">
                  <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">First Name</div>
                      {editingInfo ? (
                        <input
                          type="text"
                          placeholder={authProps.user.first_name}
                          value={changedFirstName}
                          onChange={(e) => setChangedFirstName(e.target.value)}
                        ></input>
                      ) : (
                        <div className="px-4 py-2">
                          {authProps.user.first_name}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Last Name</div>
                      {editingInfo ? (
                        <input
                          type="text"
                          placeholder={authProps.user.last_name}
                          value={changedLastName}
                          onChange={(e) => setChangedLastName(e.target.value)}
                        ></input>
                      ) : (
                        <div className="px-4 py-2">
                          {authProps.user.last_name}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Gender</div>
                      {editingInfo ? (
                        <input type="text" placeholder="Male" disabled></input>
                      ) : (
                        <div className="px-4 py-2">Male</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Weight</div>
                      {editingInfo ? (
                        <input
                          type="text"
                          placeholder={authProps.user.weight}
                          value={changedWeight}
                          onChange={(e) => setChangedWeight(e.target.value)}
                        ></input>
                      ) : (
                        <div className="px-4 py-2">{authProps.user.weight}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Height</div>
                      {editingInfo ? (
                        <input
                          type="text"
                          placeholder={authProps.user.height}
                          value={changedHeight}
                          onChange={(e) => setChangedHeight(e.target.value)}
                        ></input>
                      ) : (
                        <div className="px-4 py-2">{authProps.user.height}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Email.</div>
                      {editingInfo ? (
                        <input
                          type="text"
                          placeholder={authProps.user.user_email}
                          disabled
                        ></input>
                      ) : (
                        <div className="px-4 py-2">
                          {authProps.user.user_email}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Birthday</div>
                      {editingInfo ? (
                        <input
                          type="text"
                          placeholder={getDate(authProps.user.dob.slice(0, 10))}
                          disabled
                        ></input>
                      ) : (
                        <div className="px-4 py-2">
                          {getDate(authProps.user.dob.slice(0, 10))}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Diet</div>
                      {editingInfo ? (
                        <input
                          type="text"
                          placeholder={authProps.user.diet}
                          value={changedDiet}
                          onChange={(e) => setChangedDiet(e.target.value)}
                        ></input>
                      ) : (
                        <div className="px-4 py-2">{authProps.user.diet}</div>
                      )}
                    </div>
                  </div>
                </div>
                {editingInfo ? (
                  <React.Fragment>
                    <button
                      className="text px-4 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-2 my-3"
                      onClick={saveButtonHandler}
                    >
                      Save
                    </button>
                    <button
                      className="text px-4 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-2 my-3"
                      onClick={cancelButtonHandler}
                    >
                      Cancel
                    </button>{" "}
                  </React.Fragment>
                ) : (
                  <button
                    className="block w-full text text-sm font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
                    onClick={editButtonHandler}
                  >
                    Edit Information
                  </button>
                )}
              </div>
              {/* <!-- End of about section --> */}
            </div>
          </div>
        </div>
      </AccountLayout>
    )
  );
}
