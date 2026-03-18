import { cities } from '../generated/cities';

interface Props {
  currentSlug: string;
  onChange: (slug: string) => void;
}

export function CitySelector({ currentSlug, onChange }: Props) {
  return (
    <select
      value={currentSlug}
      onChange={e => onChange(e.target.value)}
      className="city-selector"
    >
      {cities.map(city => (
        <option key={city.slug} value={city.slug}>{city.name}</option>
      ))}
    </select>
  );
}
