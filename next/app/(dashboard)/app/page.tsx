import { defaultOptions, VerticalColumnBarChart } from "@/components/charts/bar"
import HomeChartCard from "@/components/home/home-chart-card"

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="@container lg:px-8 md:px-6 px-4 w-full max-w-6xl mx-auto">
      <div className="overflow-hidden ">
      <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
      <HomeChartCard title="Revenue" description="Revenue by month" chart={<VerticalColumnBarChart options={defaultOptions} />} />
       
      <HomeChartCard title="Revenue" description="Revenue by month" chart={<VerticalColumnBarChart options={defaultOptions} />} />
       
      <HomeChartCard title="Revenue" description="Revenue by month" chart={<VerticalColumnBarChart options={defaultOptions} />} />
       
      <HomeChartCard title="Revenue" description="Revenue by month" chart={<VerticalColumnBarChart options={defaultOptions} />} />
       </div></div>
    </div>
  )
}

export default Page