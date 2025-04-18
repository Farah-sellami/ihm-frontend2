import { Title } from "../../router";
import { CiMedal } from "react-icons/ci";
import { GiBarbedStar } from "react-icons/gi";
import {  MdOutlineCategory } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi2";

export const Dashboard = () => {
  return (
    <section>
      <div className="shadow-s1 p-8 rounded-lg mb-12">
        <Title level={5} className="font-normal">
          My Activity
        </Title>
        <hr className="my-5" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
            <CiMedal size={80} className="text-green" />
            <div>
              <Title level={1}>2</Title>
              <Title>Items Won</Title>
            </div>
          </div>
          <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
            <GiBarbedStar size={80} className="text-green" />
            <div>
              <Title level={1}>100</Title>
              <Title>Your Products</Title>
            </div>
          </div>
          <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
            <MdOutlineCategory size={80} className="text-green" />
            <div>
              <Title level={1}>50</Title>
              <Title>All Products</Title>
            </div>
          </div>
          <div className="shadow-s3 border border-green bg-green_100 p-8 flex items-center text-center justify-center gap-5 flex-col rounded-xl">
            <HiOutlineUsers size={80} className="text-green" />
            <div>
              <Title level={1}>100</Title>
              <Title>All Users</Title>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
