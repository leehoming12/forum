import React from 'react';
import { Nav } from './Nav';
import { SideMenu } from './SideMenu';
import { LayoutBody } from './LayoutBody';

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {

  const [menuWidth, setMenuWidth] = React.useState(200);

  return (
    <div className='d-flex flex-column w-100 m-0'>
      <div className='sticky-top'>
        <header className='sticky-top bg-white border-bottom'>
          <Nav />
        </header>
        <div className='row m-0 p-0 flex-fill'>
          <aside
            className='col-auto m-0 p-0 d-flex border-end'
            style={{
              overflowY: 'auto',
              position: 'absolute',
              top: '100%',
              height: 'calc(100vh - 100%)',
              width: menuWidth,
            }}
          >
            <SideMenu />
          </aside>
        </div>
      </div>
      <div className='col m-0 d-flex' style={{ paddingLeft: menuWidth }}>
        <main className='d-flex flex-fill flex-column overflow-auto'>
          <LayoutBody>
            {children}
          </LayoutBody>
        </main>
      </div>
    </div>
  );
};

export default Layout;
