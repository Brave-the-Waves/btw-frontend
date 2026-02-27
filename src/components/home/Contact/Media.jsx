import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'      

export default function Media() {
    return (
        <>
            <div className="space-y-6 mb-12 lg:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-40 max-w-2xl mx-auto">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#fc87a7]/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-[#fc87a7]" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Email</p>
                            <p className="text-slate-600">bravethewaves.braverlesvagues@gmail.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#fc87a7]/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-[#fc87a7]" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Address</p>
                            <p className="text-slate-600">22Dragons<br/>5524 Rue Saint-Patrick</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
   