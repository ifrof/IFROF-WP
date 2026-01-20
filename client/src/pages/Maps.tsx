import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Maps() {
  const { t } = useLanguage();
  const [searchType, setSearchType] = useState<"location" | "city" | "country">("location");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("50");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Using available methods from maps router
  const { data: allFactories } = trpc.maps.getFactoriesOnMap.useQuery({});
  const { data: locationResults } = trpc.maps.searchNearby.useQuery(
    {
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
      radius: parseInt(radius) || 50,
    },
    { enabled: searchType === "location" && !!latitude && !!longitude }
  );

  // Load Google Maps script
  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY environment variable.");
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !allFactories) return;

    const mapElement = document.getElementById("map");
    if (!mapElement || !(window as any).google) return;

    const map = new (window as any).google.maps.Map(mapElement, {
      zoom: 4,
      center: { lat: 25, lng: 55 }, // Center on Middle East
      mapTypeId: "roadmap",
    });

    // Add markers for all factories
    (allFactories as any[]).forEach((factory: any) => {
      if (factory.latitude && factory.longitude) {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: factory.latitude, lng: factory.longitude },
          map: map,
          title: factory.name,
            icon: factory.verificationStatus === "verified"
              ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });

        // Add info window
        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 5px 0; font-weight: bold;">${factory.name}</h3>
              <p style="margin: 0 0 5px 0; font-size: 12px;">${factory.location}</p>
              <p style="margin: 0 0 5px 0; font-size: 12px;">
                ${factory.verificationStatus === "verified" ? "✓ Verified" : "Not Verified"}
              </p>
              <a href="/factories/${factory.id}" style="color: #0066cc; text-decoration: none;">
                View Factory
              </a>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      }
    });
  }, [mapLoaded, allFactories]);

  const results = (locationResults as any[]) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <MapPin className="w-10 h-10" />
            {t("maps.title")}
          </h1>
          <p className="text-xl text-blue-100">{t("maps.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("maps.findFactories")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Type Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">{t("maps.searchType")}</label>
                <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="location">{t("maps.byLocation")}</SelectItem>
                    <SelectItem value="city">{t("maps.byCity")}</SelectItem>
                    <SelectItem value="country">{t("maps.byCountry")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Search */}
              {searchType === "location" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("maps.latitude")}
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g., 25.2048"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("maps.longitude")}
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g., 55.2708"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("maps.radius")} (km)
                    </label>
                    <Input
                      type="number"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      placeholder="50"
                    />
                  </div>
                </div>
              )}

              {/* City/Country Search */}
              {(searchType === "city" || searchType === "country") && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {searchType === "city" ? t("maps.selectCity") : t("maps.selectCountry")}
                  </label>
                  <Select
                    value={searchType === "city" ? selectedCity : selectedCountry}
                    onValueChange={(v) =>
                      searchType === "city" ? setSelectedCity(v) : setSelectedCountry(v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          searchType === "city"
                            ? t("maps.selectCity")
                            : t("maps.selectCountry")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Using a placeholder list since locations data is not available */}
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Riyadh">Riyadh</SelectItem>
                      <SelectItem value="Cairo">Cairo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle>{t("maps.factoriesMap")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="map" style={{ width: "100%", height: "500px" }} className="rounded-lg" />
            {!mapLoaded && (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t("maps.foundFactories").replace("{{count}}", String(results.length))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((factory: any) => (
                  <div
                    key={factory.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                      {factory.logoUrl && (
                        <img
                          src={factory.logoUrl}
                          alt={factory.name}
                          className="w-full h-40 object-cover"
                        />
                      )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{factory.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1 mb-3">
                        <p>📍 {factory.location}</p>
                        {factory.distance && (
                          <p className="text-blue-600 font-medium">
                            {factory.distance.toFixed(1)} km {t("maps.away")}
                          </p>
                        )}
                      </div>
                      {factory.verificationStatus === "verified" && (
                        <div className="mb-3 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          ✓ {t("common.verified")}
                        </div>
                      )}
                      <Link href={`/factories/${factory.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          {t("common.viewDetails")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {results && results.length === 0 && (searchType === "location" || selectedCity || selectedCountry) && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{t("maps.noResults")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
