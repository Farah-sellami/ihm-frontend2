import { Container, Heading, Title } from "../../router";
import { processList } from "../../utils/data";

export const Process = () => {
  return (
    <>
      <section className="process py-2 bg-gray-100">
        {/* <div className="bg-white w-full py-20 -mt-10 rounded-b-[40px] z-10 absolute top-0"></div> */}
        <Container className="py-16 pt-24 text-blue">
          <Heading title="How It Works" subtitle="Easy 4 steps to win" />

          <div className="content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">           
             {processList.map((item, index) => (
              <div key={index} className="p-8 bg-white rounded-xl flex items-center justify-center flex-col text-center"
>
                <div className="w-16 h-16">
                  <img src={item.cover} alt="" />
                </div>
                <Title level={5} className="my-3 font-normal text-[#20354c]">
                  {item.title}
                </Title>
                <p className="text-primary">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
        {/* <div className="bg-white w-full py-16 rounded-t-[40px] z-0 absolute -bottom-0"></div> */}
      </section>
    </>
  );
};
