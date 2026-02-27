import { motion } from 'framer-motion'

const galleryImages = ["https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/past_events_gallery%2F2025Image1.JPG?alt=media&token=56a140bd-85c9-45ac-92c7-246feb7ec82f", "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/past_events_gallery%2F2025Image2.jpg?alt=media&token=fb809ce6-6344-4c89-a814-944697843d98", "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/past_events_gallery%2F2025Image3.jpg?alt=media&token=d3b113a3-2ea6-4515-bd30-82a160c6c485", "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/past_events_gallery%2F2025Image4.jpg?alt=media&token=5fb4959c-8a41-468d-910d-c97803f4bb11", "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/past_events_gallery%2F2025Image5.JPG?alt=media&token=381e65bd-d632-4ed1-a11c-f2369eed806c", "https://firebasestorage.googleapis.com/v0/b/brave-the-waves-backend.firebasestorage.app/o/past_events_gallery%2F2025Image6.JPG?alt=media&token=57587d6e-93be-407f-a49b-95384dfad8d5"]

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