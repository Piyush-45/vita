import BgGradient from '@/components/common/bg-gradient'
import Header from '@/components/common/Header'
import Test from '@/components/common/test'
import DemoSection from '@/components/home/demo-section'
import HeroSection from '@/components/home/hero-section'
import HowItWorksSection from '@/components/home/how-it-works'
import PricingSection from '@/components/home/pricing'


const page = () => {


  return (
    <div className="relative w-full ">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        {/* <DemoSection /> */}
        <HowItWorksSection />
        <PricingSection />
      </div>
    </div>
  )
}

export default page