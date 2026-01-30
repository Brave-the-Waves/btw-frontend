import { motion } from 'framer-motion'

import img1 from '../../../assets/images/2025/2025Image1.jpg'
import img2 from '../../../assets/images/2025/2025Image2.jpg'
import img3 from '../../../assets/images/2025/2025Image3.jpg'
import img4 from '../../../assets/images/2025/2025Image4.jpg'
import img5 from '../../../assets/images/2025/2025Image5.jpg'
import img6 from '../../../assets/images/2025/2025Image6.jpg'

const galleryImages = [img1, img2, img3, img4, img5, img6]

export default function PastEventsGallery() {
    return (
        <>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-100px' }} className="mb-20">
            <h3 className="text-2xl font-bold text-center mb-8">Event Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="aspect-square rounded-2xl overflow-hidden group">
                    <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
                ))}
            </div>
            </motion.div>
        </>
    )
}