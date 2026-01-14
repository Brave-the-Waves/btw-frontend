import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'      

export default function Media() {
    return (
        <>
            <div className="space-y-6 mb-12 lg:mb-0">
                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#fc87a7]/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-[#fc87a7]" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Email</p>
                            <p className="text-slate-600">info@bravethewaves.org</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#fc87a7]/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-[#fc87a7]" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Phone</p>
                            <p className="text-slate-600">(555) 123-4567</p>
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

            <div className="mb-10 lg:mb-0">
                <p className="font-semibold text-slate-900 mb-4">Follow Us</p>
                <div className="flex gap-3">
                    <a href="#" className="w-11 h-11 rounded-full bg-slate-200 hover:bg-[#fc87a7] flex items-center justify-center transition-colors group"><Facebook className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" /></a>
                    <a href="#" className="w-11 h-11 rounded-full bg-slate-200 hover:bg-[#fc87a7] flex items-center justify-center transition-colors group"><Instagram className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" /></a>
                    <a href="#" className="w-11 h-11 rounded-full bg-slate-200 hover:bg-[#fc87a7] flex items-center justify-center transition-colors group"><Twitter className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" /></a>
                </div>
            </div>
        </>
    )
}
   