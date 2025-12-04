import { motion } from 'framer-motion'

const galleryImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80',
    'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=400&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
]

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