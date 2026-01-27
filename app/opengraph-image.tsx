import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Guemes Services - Community Board'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: '#0c0a09', // stone-950
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'serif',
                    position: 'relative',
                }}
            >
                {/* Border Accent */}
                <div
                    style={{
                        position: 'absolute',
                        top: '20px',
                        bottom: '20px',
                        left: '20px',
                        right: '20px',
                        border: '2px solid #292524', // stone-800
                        borderRadius: '12px',
                    }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1
                        style={{
                            fontSize: '96px',
                            color: '#f5f5f4', // stone-100
                            margin: '0 0 20px 0',
                            fontWeight: 700,
                            letterSpacing: '-2px',
                            lineHeight: '1',
                            textAlign: 'center',
                        }}
                    >
                        Guemes Services
                    </h1>
                    <p
                        style={{
                            fontSize: '32px',
                            color: '#a8a29e', // stone-400
                            margin: 0,
                            fontFamily: 'sans-serif',
                            textTransform: 'uppercase',
                            letterSpacing: '4px',
                        }}
                    >
                        Community Board
                    </p>
                </div>
            </div>
        ),
        // ImageResponse options
        {
            // We can add custom fonts here if needed, but for now system fonts or default will do 
            // to keep it simple and robust.
            ...size,
        }
    )
}
