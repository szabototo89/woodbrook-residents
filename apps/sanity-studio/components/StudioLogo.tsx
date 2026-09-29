import type {JSX} from 'react'

// Brand mark echoing the public website: forest rounded square with a serif W,
// next to the site name in the Studio navbar.
export function StudioLogo(): JSX.Element {
  return (
    <span style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '38px',
          borderRadius: '15px 15px 4px 4px',
          backgroundColor: '#416b58',
          color: '#fffdf8',
          fontFamily: 'Georgia, serif',
          fontSize: '22px',
          fontWeight: 600,
        }}
      >
        W
      </span>
      <span style={{fontFamily: 'Georgia, serif', fontSize: '17px', color: '#274038'}}>
        Woodbrook Residents
      </span>
    </span>
  )
}
