import React from "react";
import { Caption, Title } from "../../router";
import { commonClassNameOfInput, PrimaryButton } from "../../components/common/Design";

export const UserProfile = () => {
  const User2 ="https://res.cloudinary.com/defx74d1x/image/upload/v1734432363/owmse7hwghoctefzby4v.jpg"

  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="profile flex items-center gap-8">
          <img src={User2} alt="" className="w-24 h-24 rounded-full object-cover" />
          <div>
            <Title level={5} className="capitalize">
              Principal Admin
            </Title>
            <Caption>00000000</Caption>
          </div>
        </div>
        <form>
          <div className="flex items-center gap-5 mt-10">
            <div className="w-full">
              <Caption className="mb-2">Full Name </Caption>
              <input type="search" className={`capitalize ${commonClassNameOfInput}`} placeholder="Sunil" readOnly />
            </div>
          </div>
          <div className="flex items-center gap-5 mt-10">
            <div className="w-1/2">
              <Caption className="mb-2">Contact Number</Caption>
              <input type="search" className={commonClassNameOfInput} placeholder="Contact Number" />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">CIN</Caption>
              <input type="search" className={commonClassNameOfInput} placeholder="example@gmail.com" disabled />
            </div>
          </div>
          <div className="my-8">
            <Caption className="mb-2">Role</Caption>
            <input type="search" className={commonClassNameOfInput} placeholder="admin" required />
          </div>
          <div className="my-8">
            <Caption className="mb-2"> City</Caption>
            <input type="search" className={commonClassNameOfInput} placeholder="Working" required />
          </div>
          <PrimaryButton>Update Profile</PrimaryButton>
        </form>
      </section>
    </>
  );
};
