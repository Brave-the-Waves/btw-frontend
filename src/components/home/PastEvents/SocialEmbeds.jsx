import { motion } from 'framer-motion'

export default function SocialEmbeds({ instagramUrl, facebookUrl, instagramPostUrl }) {
  const postBase = instagramPostUrl ? instagramPostUrl.split('?')[0].replace(/\/?$/, '') : null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">Instagram</h4>
        <p className="text-sm text-slate-400 mb-4">Latest post from our Instagram.</p>
        {postBase ? (
          <div className="mb-4">
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <iframe
                title="instagram-post"
                src={`${postBase}/embed`}
                width="100%"
                height="600"
                style={{ border: 'none', display: 'block', minHeight: 300 }}
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media; picture-in-picture"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[0,1,2,3].map((i) => (
              <a key={i} href={instagramUrl} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg bg-slate-700/30 flex items-center justify-center hover:opacity-90 transition">
                <span className="text-sm text-slate-300">View on Instagram</span>
              </a>
            ))}
          </div>
        )}
        
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4">Facebook</h4>
        <p className="text-sm text-slate-400 mb-4">Our Facebook page.</p>
        <div className="w-full rounded-lg overflow-hidden border border-slate-700">
          <iframe
            title="Facebook Page"
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookUrl)}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
            width="100%"
            height="600"
            style={{ border: 'none', overflow: 'hidden', minHeight: 300 }}
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        </div>
      </div>
    </motion.div>
  )
}
