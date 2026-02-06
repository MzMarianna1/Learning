/**
 * NextStepCTA Component
 * Displays a clear, prominent next action for the user
 */

import { motion } from 'motion/react';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NextStepCTAProps {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success';
  external?: boolean;
}

export default function NextStepCTA({
  title,
  description,
  actionText,
  actionLink,
  icon: Icon,
  variant = 'primary',
  external = false,
}: NextStepCTAProps) {
  const variantStyles = {
    primary: 'from-purple-600 via-pink-600 to-cyan-600',
    secondary: 'from-orange-500 to-red-500',
    success: 'from-green-500 to-emerald-500',
  };

  const CTAContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200"
    >
      <div className="flex items-center gap-4 mb-4">
        {Icon && (
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${variantStyles[variant]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>

      {external ? (
        <a
          href={actionLink}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={`w-full bg-gradient-to-r ${variantStyles[variant]} text-white py-4 px-8 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 group`}
        >
          {actionText}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </a>
      ) : (
        <Link
          to={actionLink}
          className={`block w-full bg-gradient-to-r ${variantStyles[variant]} text-white py-4 px-8 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl transition-all text-center group`}
        >
          <span className="flex items-center justify-center gap-2">
            {actionText}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      )}
    </motion.div>
  );

  return CTAContent;
}
