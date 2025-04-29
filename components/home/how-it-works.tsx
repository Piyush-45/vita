import { BrainCircuit, FileOutput, FileText, MoveRight, Pizza } from 'lucide-react'
import React, { ReactNode } from 'react'


type Step = {
    icon: ReactNode,
    label: string,
    description: string
}

const steps: Step[] = [
    {
        icon: <FileText size={64} strokeWidth={2} />,
        label: 'Upload Your Report',
        description: 'Upload the confusing stuff you got from the lab',
    },
    {
        icon: <BrainCircuit size={64} strokeWidth={2} />,
        label: 'We Decode It',
        description: 'Our smart engine + a dash of humor reads and understands your report.',
    },
    {
        icon: <FileOutput size={64} strokeWidth={2} />,
        label: 'Get a Fun, Friendly Explanation',
        description: 'No jargon. Just plain, clear English — maybe even a joke or two!',
    }
]


const HowItWorksSection = () => {
    return (
        <section className='relative  bg-gray-50'>
            <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
                >
                    <div
                        className="relative left-[calc(50%-3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-20 sm:left-[calc(40%-30rem)] sm:w-[40.1875rem]"
                        style={{
                            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>


                <div className="text-center mb-16">
                    <h2 className='font-bold text-xl uppercase mb-4 text-[#1B3669]'>How it works</h2>
                    <h3 className='font-bold text-3xl max-w-2xl mx-auto '>Transform any PDF into an easy-to-digest summary in three simple steps</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
                    {
                        steps.map((step, idx) => (
                            <div className="relative flex items-stretch" key={idx}>

                                {/* stepitem */}
                                <div className='relative p-6 rounded-2xl bg-white/5 backdrop-blur-xs border-white/10 hover:border-[#F0F6FF] transition-colors group w-full' >
                                    <div className="flex flex-col gap-4 h-full ">
                                        <div className='flex items-center justify-center h-24 w-24 mx-auto rounded-2xl bg-linear-to-br from-rose[#EEF7F7] to-transparent group-hover:from-[#EEF7F7] transition-colors'>
                                            <div className='text-[#088972]'>{step.icon}</div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col flex-1 gap-1 justify-between '>
                                        <h4 className='text-center font-bold'>{step.label}</h4>
                                        <p className='text-center text-gray-600 text-sm'>{step.description}</p>
                                    </div>
                                </div>

                                <div className='hidden md:block absolute top-1/2 -right-4 transform -transalate-y-1/2 z-10'>
                                    {idx < steps.length - 1 && (<MoveRight size={32} strokeWidth={1} className='text-[#088972]' ></MoveRight>)}
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </section>
    )
}

export default HowItWorksSection