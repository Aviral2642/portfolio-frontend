import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    variants={variants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export default Reveal;


