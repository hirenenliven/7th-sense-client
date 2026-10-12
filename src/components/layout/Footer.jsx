import env from '@/config/env'

function Footer() {
  return (
    <footer className="ts-footer">
      &copy; {new Date().getFullYear()} {env.appName}. All rights reserved.
    </footer>
  )
}

export default Footer
