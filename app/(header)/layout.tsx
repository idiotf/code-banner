const HeaderLayout = ({ children }: React.PropsWithChildren) =>
  <main className='min-h-full'>
    <section className='px-3 m-auto max-w-5xl'>
      {children}
    </section>
  </main>

export default HeaderLayout
