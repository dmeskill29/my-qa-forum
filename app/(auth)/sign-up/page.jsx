import SignUp from "@/components/SignUp";


const page = ({}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;
