export type Palette = {
  sky: [string, string]
  land: [string, string, string]
  wash: string
}

export type GalleryArtwork = {
  id: string
  title: string
  year: string
  decade: string
  medium: string
  dim: string
  location: string
  subject: string
  image?: string
  palette?: Palette
  layout?: string
  seed?: number
  tags: string[]
  status: 'published' | 'draft' | 'private'
  catalogue: string
  provenance?: string
  inscribed?: string
  blurb?: string
}

export type JournalEntry = {
  id: string
  date: string
  title: string
  dek: string
  author: string
}

const KH_CDN =
  'https://webfuel.blob.core.windows.net/webfuel-filesystem/8551ca70-3fd8-b1c7-d133-08d69bd28840'

const P: Record<string, Palette> = {
  derbyshire:  { sky: ['#cfd9d4', '#a9b9b1'], land: ['#7a8a6e', '#5a6b54', '#3d4a3a'], wash: '#c9b88a' },
  riviera:     { sky: ['#f3e3c8', '#e7c790'], land: ['#cf8a4f', '#b06535', '#7e3f1f'], wash: '#a65a3d' },
  venice:      { sky: ['#dfe4ea', '#a8b3c5'], land: ['#5e7596', '#3a4f6f', '#2a3a55'], wash: '#1f3c5c' },
  industrial:  { sky: ['#dcd6cb', '#b3aa9b'], land: ['#736c61', '#4d4842', '#2c2925'], wash: '#a65a3d' },
  michigan:    { sky: ['#e9e2cf', '#cab98e'], land: ['#a07a4f', '#6b4d2c', '#3e2c1a'], wash: '#8e4830' },
  cotswolds:   { sky: ['#e8e4d2', '#bcc5a8'], land: ['#9aa279', '#6e7a55', '#4a5239'], wash: '#a65a3d' },
  lune:        { sky: ['#e0e6d8', '#9fb3a4'], land: ['#7d8c79', '#54624f', '#34402f'], wash: '#1f3c5c' },
  portrait:    { sky: ['#efe5d0', '#d4c5a2'], land: ['#9a6f54', '#6e4733', '#3d2517'], wash: '#a65a3d' },
  yugoslav:    { sky: ['#e7d9bb', '#c89e69'], land: ['#a16640', '#6b3d22', '#3a2114'], wash: '#1f3c5c' },
  storm:       { sky: ['#bfc4c9', '#7c8390'], land: ['#5d6470', '#373b48', '#1d2030'], wash: '#1f3c5c' },
  highland:    { sky: ['#dfe6e0', '#a3b6b2'], land: ['#7a8a82', '#4f5f5a', '#2f3a37'], wash: '#1f3c5c' },
  spring:      { sky: ['#ecead0', '#cfd1a5'], land: ['#a4ad7e', '#7a8456', '#4f5836'], wash: '#a65a3d' },
}

const W = 'Watercolour on paper'
const O = 'Oil on canvas'

const ARTWORKS: GalleryArtwork[] = [
  { id:'kh-001', title:'The Cotswolds above Chipping Campden', year:'c. 1935', decade:'1930s', medium:W, dim:'36 × 54 cm', location:'Cotswolds, England', subject:'Landscape', image:`${KH_CDN}/Cotswolds.jpeg`, tags:['Landscape','Cotswolds','England'], status:'published', catalogue:'0001', provenance:'Private collection, Gloucestershire', inscribed:'Signed lower right, Knighton-Hammond', blurb:'A high view across the Cotswold escarpment, made on a painting tour from Chipping Campden in the spring of 1935.' },
  { id:'kh-002', title:'A French Square', year:'1928', decade:'1920s', medium:W, dim:'30 × 44 cm', location:'Provence, France', subject:'Riviera', image:`${KH_CDN}/library/IMGP5920.JPG`, tags:['Riviera','France','Architecture'], status:'published', catalogue:'0002', provenance:'Private collection, London', inscribed:'Signed lower left', blurb:'Painted during the long winter on the Riviera in 1928.' },
  { id:'kh-003', title:'Reeves the Tramp', year:'1923', decade:'1920s', medium:W, dim:'41 × 28 cm', location:'England', subject:'Portrait', image:`${KH_CDN}/library/IMGP5953.JPG`, tags:['Portrait','Character'], status:'published', catalogue:'0003', provenance:"Acquired from the artist's estate, 1971", inscribed:'Signed and dated lower right, 1923', blurb:'An unusual sitter for a society portraitist.' },
  { id:'kh-004', title:'Middleton Dale, Derbyshire', year:'c. 1908', decade:'1900s', medium:W, dim:'34 × 51 cm', location:'Derbyshire, England', subject:'Landscape', palette:P.derbyshire, layout:'open-valley', seed:7, tags:['Landscape','Derbyshire'], status:'published', catalogue:'0004' },
  { id:'kh-005', title:'Evening Glow — Menton', year:'1928', decade:'1920s', medium:W, dim:'28 × 41 cm', location:'Menton, France', subject:'Riviera', palette:P.riviera, layout:'sunset-bay', seed:14, tags:['Riviera','France'], status:'published', catalogue:'0005' },
  { id:'kh-006', title:'Epsom Downs, Derby Week', year:'1931', decade:'1930s', medium:W, dim:'36 × 54 cm', location:'Surrey, England', subject:'Society', palette:P.spring, layout:'crowd', seed:21, tags:['Society','Crowd','Sport'], status:'published', catalogue:'0006' },
  { id:'kh-007', title:'Dow Plant Interior, Michigan', year:'1925', decade:'1920s', medium:O, dim:'61 × 92 cm', location:'Midland, Michigan', subject:'Industrial', palette:P.industrial, layout:'factory', seed:33, tags:['Industrial','Michigan','USA'], status:'published', catalogue:'0007' },
  { id:'kh-008', title:'The Crook of Lune', year:'c. 1932', decade:'1930s', medium:W, dim:'34 × 51 cm', location:'Lancashire, England', subject:'Landscape', palette:P.lune, layout:'river-bend', seed:40, tags:['Landscape','River'], status:'published', catalogue:'0008' },
  { id:'kh-009', title:'Venice, Early Morning', year:'1922', decade:'1920s', medium:W, dim:'30 × 44 cm', location:'Venice, Italy', subject:'Travel', palette:P.venice, layout:'venice-canal', seed:55, tags:['Travel','Venice','Italy'], status:'published', catalogue:'0009' },
  { id:'kh-010', title:'Highland Glen, Argyll', year:'c. 1947', decade:'1940s', medium:W, dim:'32 × 48 cm', location:'Argyll, Scotland', subject:'Landscape', palette:P.highland, layout:'open-valley', seed:62, tags:['Landscape','Scotland'], status:'published', catalogue:'0010' },
  { id:'kh-011', title:'Sarajevo Market', year:'1934', decade:'1930s', medium:W, dim:'34 × 50 cm', location:'Sarajevo, Yugoslavia', subject:'Travel', palette:P.yugoslav, layout:'crowd', seed:69, tags:['Travel','Balkans'], status:'published', catalogue:'0011' },
  { id:'kh-012', title:'After the Storm, Cromer', year:'1953', decade:'1950s', medium:W, dim:'28 × 44 cm', location:'Norfolk, England', subject:'Landscape', palette:P.storm, layout:'sea', seed:71, tags:['Landscape','Coast'], status:'published', catalogue:'0012' },
  { id:'kh-013', title:'Old Cottage, Bibury', year:'c. 1937', decade:'1930s', medium:W, dim:'30 × 44 cm', location:'Cotswolds, England', subject:'Landscape', palette:P.cotswolds, layout:'cottage', seed:81, tags:['Landscape','Cotswolds'], status:'published', catalogue:'0013' },
  { id:'kh-014', title:'Portrait of Lady Wakefield', year:'1929', decade:'1920s', medium:O, dim:'76 × 61 cm', location:'London, England', subject:'Portrait', palette:P.portrait, layout:'portrait', seed:90, tags:['Portrait','Society'], status:'published', catalogue:'0014' },
  { id:'kh-015', title:'Sienese Hills', year:'1924', decade:'1920s', medium:W, dim:'28 × 42 cm', location:'Tuscany, Italy', subject:'Travel', palette:P.riviera, layout:'open-valley', seed:101, tags:['Travel','Italy'], status:'published', catalogue:'0015' },
  { id:'kh-016', title:'Mill at Ashford-in-the-Water', year:'c. 1910', decade:'1910s', medium:W, dim:'32 × 47 cm', location:'Derbyshire, England', subject:'Landscape', palette:P.derbyshire, layout:'river-bend', seed:111, tags:['Landscape','Derbyshire','Architecture'], status:'published', catalogue:'0016' },
  { id:'kh-017', title:'Carrara Marble Quarry', year:'1923', decade:'1920s', medium:W, dim:'34 × 51 cm', location:'Carrara, Italy', subject:'Industrial', palette:P.industrial, layout:'quarry', seed:124, tags:['Industrial','Italy'], status:'published', catalogue:'0017' },
  { id:'kh-018', title:"Cap d'Antibes", year:'1927', decade:'1920s', medium:W, dim:'30 × 44 cm', location:"Côte d'Azur, France", subject:'Riviera', palette:P.riviera, layout:'sea', seed:133, tags:['Riviera','France','Sea'], status:'published', catalogue:'0018' },
  { id:'kh-019', title:'Late Snow, Buxton', year:'c. 1958', decade:'1950s', medium:W, dim:'28 × 41 cm', location:'Derbyshire, England', subject:'Landscape', palette:P.lune, layout:'open-valley', seed:142, tags:['Landscape','Winter'], status:'published', catalogue:'0019' },
  { id:'kh-020', title:'Dow Plant — The Hot Floor', year:'1924', decade:'1920s', medium:O, dim:'58 × 88 cm', location:'Midland, Michigan', subject:'Industrial', palette:P.industrial, layout:'factory', seed:151, tags:['Industrial','Michigan','USA'], status:'published', catalogue:'0020' },
  { id:'kh-021', title:'Mrs Edith Knighton-Hammond', year:'1908', decade:'1900s', medium:W, dim:'43 × 28 cm', location:'London, England', subject:'Portrait', palette:P.portrait, layout:'portrait', seed:163, tags:['Portrait','Family'], status:'published', catalogue:'0021' },
  { id:'kh-022', title:'Olive Trees, Bordighera', year:'c. 1929', decade:'1920s', medium:W, dim:'30 × 44 cm', location:'Liguria, Italy', subject:'Riviera', palette:P.riviera, layout:'open-valley', seed:172, tags:['Riviera','Italy'], status:'published', catalogue:'0022' },
  { id:'kh-023', title:'Ploughing — Oxfordshire', year:'1949', decade:'1940s', medium:W, dim:'30 × 47 cm', location:'Oxfordshire, England', subject:'Landscape', palette:P.cotswolds, layout:'open-valley', seed:184, tags:['Landscape','Rural'], status:'published', catalogue:'0023' },
  { id:'kh-024', title:'Old Bridge at Mostar', year:'1934', decade:'1930s', medium:W, dim:'32 × 48 cm', location:'Mostar, Yugoslavia', subject:'Travel', palette:P.yugoslav, layout:'river-bend', seed:193, tags:['Travel','Balkans','Architecture'], status:'published', catalogue:'0024' },
  { id:'kh-025', title:'Storm over Snowdonia', year:'c. 1939', decade:'1930s', medium:W, dim:'34 × 50 cm', location:'Gwynedd, Wales', subject:'Landscape', palette:P.storm, layout:'mountain', seed:204, tags:['Landscape','Wales','Mountain'], status:'published', catalogue:'0025' },
  { id:'kh-026', title:'Sir Henry Trapp, KBE', year:'1932', decade:'1930s', medium:O, dim:'82 × 64 cm', location:'London, England', subject:'Portrait', palette:P.portrait, layout:'portrait', seed:213, tags:['Portrait','Society'], status:'published', catalogue:'0026' },
  { id:'kh-027', title:'Vines at Cassis', year:'1928', decade:'1920s', medium:W, dim:'28 × 42 cm', location:'Provence, France', subject:'Riviera', palette:P.riviera, layout:'open-valley', seed:222, tags:['Riviera','France'], status:'published', catalogue:'0027' },
  { id:'kh-028', title:'Lambeth Bridge, Fog', year:'1919', decade:'1910s', medium:W, dim:'30 × 44 cm', location:'London, England', subject:'Landscape', palette:P.storm, layout:'river-bend', seed:233, tags:['Landscape','London'], status:'published', catalogue:'0028' },
  { id:'kh-029', title:'Threshing — Late Summer', year:'c. 1948', decade:'1940s', medium:W, dim:'30 × 46 cm', location:'Devon, England', subject:'Landscape', palette:P.spring, layout:'crowd', seed:241, tags:['Landscape','Rural'], status:'published', catalogue:'0029' },
  { id:'kh-030', title:'Misty Morning, Rio dei Mendicanti', year:'1922', decade:'1920s', medium:W, dim:'28 × 41 cm', location:'Venice, Italy', subject:'Travel', palette:P.venice, layout:'venice-canal', seed:252, tags:['Travel','Venice'], status:'published', catalogue:'0030' },
  { id:'kh-031', title:'Smelting Hall, Detroit', year:'1925', decade:'1920s', medium:O, dim:'56 × 84 cm', location:'Detroit, Michigan', subject:'Industrial', palette:P.industrial, layout:'factory', seed:261, tags:['Industrial','USA'], status:'published', catalogue:'0031' },
  { id:'kh-032', title:'The Wye at Tintern', year:'1955', decade:'1950s', medium:W, dim:'30 × 46 cm', location:'Monmouthshire, Wales', subject:'Landscape', palette:P.lune, layout:'river-bend', seed:271, tags:['Landscape','Wales','River'], status:'published', catalogue:'0032' },
  { id:'kh-045', title:'Field at Seaborough (last work?)', year:'c. 1968', decade:'1960s', medium:W, dim:'24 × 36 cm', location:'Devon, England', subject:'Landscape', palette:P.spring, layout:'open-valley', seed:401, tags:['Landscape','Devon','Late'], status:'published', catalogue:'0045', provenance:'By descent in the family', inscribed:'Unsigned', blurb:"Believed to be one of the artist's final paintings." },
]

const JOURNAL: JournalEntry[] = [
  { id:'j-001', date:'14 March 2026', title:'A new attribution from a Buxton attic', dek:'A small watercolour found in a private collection in Derbyshire turns out to be the artist working in oils for the first time, aged twenty-one.', author:'Helen Marsden, Trustee' },
  { id:'j-002', date:'02 February 2026', title:'Conserving "Reeves the Tramp"', dek:'Notes from the studio on a careful re-mounting of one of the most surprising portraits in the catalogue.', author:'Edward Bligh, Conservator' },
  { id:'j-003', date:'19 January 2026', title:'On Knighton-Hammond in Michigan', dek:"A lecture at the University of Detroit on the artist's years painting the Dow chemical works between 1923 and 1926.", author:'Dr. Anne Rivers' },
]

export const useArtworks = () => ({
  artworks: ARTWORKS as readonly GalleryArtwork[],
  journal: JOURNAL as readonly JournalEntry[],
})
