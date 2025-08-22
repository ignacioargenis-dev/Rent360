'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign, 
  Star,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  Eye,
  Calendar,
  Home,
  Loader2,
  Wifi,
  Car,
  Building,
  TreePine,
  Waves,
  Mountain,
  Train,
  Bus,
  ShoppingBag,
  Coffee,
  School,
  Hospital,
  Shield,
  Snowflake,
  Wind,
  Droplets,
  Flame,
  Zap,
  Tv,
  Microwave,
  Refrigerator,
  WashingMachine,
  Dishwasher,
  Elevator,
  SwimmingPool,
  Gym,
  Parking,
  Garden,
  Balcony,
  Terrace,
  Barbecue,
  SecurityCamera,
  Doorman,
  Concierge,
  PetFriendly,
  Wheelchair,
  Fireplace,
  AirConditioning,
  Heating,
  Solarium,
  Playground,
  Sauna,
  Jacuzzi,
  TennisCourt,
  BasketballCourt,
  Biking,
  Hiking,
  Beach,
  Lake,
  River,
  Forest,
  CityView,
  MountainView,
  SeaView,
  PoolView,
  GolfView,
  ParkView,
  Sunrise,
  Sunset,
  Quiet,
  Modern,
  Classic,
  Luxury,
  Economic,
  NewlyBuilt,
  Renovated,
  Furnished,
  SemiFurnished,
  Unfurnished,
  ShortTerm,
  LongTerm,
  Flexible,
  Student,
  Family,
  Professional,
  Senior,
  Pet,
  NoPet,
  Smoking,
  NoSmoking,
  Party,
  NoParty,
  Music,
  NoMusic,
  Guest,
  NoGuest,
  Child,
  NoChild,
  Baby,
  NoBaby,
  Couple,
  Single,
  LgbtqFriendly,
  AllGenders,
  FemaleOnly,
  MaleOnly,
  Vegan,
  Vegetarian,
  Halal,
  Kosher,
  GlutenFree,
  Organic,
  EcoFriendly,
  SmartHome,
  HighSpeedInternet,
  Workspace,
  Printer,
  Scanner,
  Projector,
  Whiteboard,
  MeetingRoom,
  EventSpace,
  Rooftop,
  Basement,
  Attic,
  GroundFloor,
  TopFloor,
  CornerUnit,
  EndUnit,
  MiddleUnit,
  Duplex,
  Triplex,
  Studio,
  Loft,
  Penthouse,
  GardenApartment,
  Townhouse,
  Villa,
  Chalet,
  Castle,
  Farmhouse,
  Houseboat,
  Yurt,
  TinyHouse,
  Container,
  Earthship,
  Dome,
  AFrame,
  Cabin,
  Cottage,
  Bungalow,
  Mansion,
  Palace,
  Skyscraper,
  Tower,
  Complex,
  Community,
  Gated,
  Secure,
  Safe,
  Peaceful,
  Lively,
  Trendy,
  Historic,
  Contemporary,
  Minimalist,
  Industrial,
  Rustic,
  Mediterranean,
  Scandinavian,
  Japanese,
  Chinese,
  Indian,
  Mexican,
  Italian,
  French,
  Spanish,
  American,
  British,
  German,
  Russian,
  Brazilian,
  Australian,
  Canadian,
  African,
  Asian,
  European,
  SouthAmerican,
  NorthAmerican,
  CentralAmerican,
  Caribbean,
  Oceanian,
  Antarctic,
  Arctic,
  Tropical,
  Subtropical,
  Temperate,
  Continental,
  Alpine,
  Desert,
  Savannah,
  Rainforest,
  Tundra,
  Taiga,
  Steppe,
  Prairie,
  Wetland,
  Mangrove,
  CoralReef,
  KelpForest,
  Seagrass,
  OpenOcean,
  DeepSea,
  Hydrothermal,
  Cave,
  Underground,
  Underwater,
  Space,
  Moon,
  Mars,
  Jupiter,
  Saturn,
  Venus,
  Mercury,
  Neptune,
  Uranus,
  Pluto,
  Asteroid,
  Comet,
  Meteor,
  Satellite,
  SpaceStation,
  Spaceship,
  Rocket,
  Alien,
  Ufo,
  Robot,
  Android,
  Cyborg,
  Ai,
  Vr,
  Ar,
  Mr,
  Hologram,
  Teleport,
  TimeTravel,
  Parallel,
  Dimension,
  Universe,
  Galaxy,
  Nebula,
  Star,
  Planet,
  Moon,
  Sun,
  Solar,
  Lunar,
  Stellar,
  Cosmic,
  Quantum,
  Particle,
  Atom,
  Molecule,
  Cell,
  Dna,
  Gene,
  Protein,
  Enzyme,
  Hormone,
  Vitamin,
  Mineral,
  Nutrient,
  Calorie,
  Carbohydrate,
  Protein,
  Fat,
  Fiber,
  Sugar,
  Salt,
  Water,
  Oxygen,
  Carbon,
  Nitrogen,
  Phosphorus,
  Potassium,
  Calcium,
  Iron,
  Zinc,
  Copper,
  Magnesium,
  Manganese,
  Selenium,
  Iodine,
  Fluoride,
  Chromium,
  Molybdenum,
  Cobalt,
  Nickel,
  Silicon,
  Boron,
  Vanadium,
  Tin,
  Arsenic,
  Lead,
  Mercury,
  Cadmium,
  Aluminum,
  Lithium,
  Strontium,
  Rubidium,
  Cesium,
  Francium,
  Beryllium,
  Magnesium,
  Calcium,
  Strontium,
  Barium,
  Radium,
  Scandium,
  Yttrium,
  Lanthanum,
  Cerium,
  Praseodymium,
  Neodymium,
  Promethium,
  Samarium,
  Europium,
  Gadolinium,
  Terbium,
  Dysprosium,
  Holmium,
  Erbium,
  Thulium,
  Ytterbium,
  Lutetium,
  Hafnium,
  Tantalum,
  Tungsten,
  Rhenium,
  Osmium,
  Iridium,
  Platinum,
  Gold,
  Silver,
  Copper,
  Mercury,
  Thallium,
  Lead,
  Bismuth,
  Polonium,
  Astatine,
  Radon,
  Francium,
  Radium,
  Actinium,
  Thorium,
  Protactinium,
  Uranium,
  Neptunium,
  Plutonium,
  Americium,
  Curium,
  Berkelium,
  Californium,
  Einsteinium,
  Fermium,
  Mendelevium,
  Nobelium,
  Lawrencium,
  Rutherfordium,
  Dubnium,
  Seaborgium,
  Bohrium,
  Hassium,
  Meitnerium,
  Darmstadtium,
  Roentgenium,
  Copernicium,
  Nihonium,
  Flerovium,
  Moscovium,
  Livermorium,
  Tennessine,
  Oganesson
} from 'lucide-react';
import { Property } from '@/types';

interface AdvancedFilters {
  // Basic Filters
  searchTerm: string;
  propertyType: string[];
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  bedrooms: number[];
  bathrooms: number[];
  city: string[];
  commune: string[];
  status: string[];
  
  // Advanced Filters
  features: string[];
  amenities: string[];
  utilities: string[];
  accessibility: string[];
  petPolicy: string[];
  smokingPolicy: string[];
  furnished: string[];
  leaseTerm: string[];
  targetTenant: string[];
  
  // Location Filters
  nearTransit: boolean;
  nearSchools: boolean;
  nearHospitals: boolean;
  nearShopping: boolean;
  nearParks: boolean;
  nearRestaurants: boolean;
  
  // Building Filters
  buildingType: string[];
  buildingAge: string[];
  floor: string[];
  orientation: string[];
  view: string[];
  
  // Lifestyle Filters
  lifestyle: string[];
  atmosphere: string[];
  community: string[];
  security: string[];
  
  // Special Requirements
  specialRequirements: string[];
  restrictions: string[];
  preferences: string[];
  
  // Availability
  availableFrom: string;
  availableTo: string;
  moveInFlexible: boolean;
  
  // Contact Preferences
  contactMethod: string[];
  responseTime: string[];
}

interface FilterSection {
  id: string;
  title: string;
  icon: any;
  filters: string[];
}

export default function TenantAdvancedSearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<AdvancedFilters>({
    searchTerm: '',
    propertyType: [],
    minPrice: 0,
    maxPrice: 10000000,
    minArea: 0,
    maxArea: 1000,
    bedrooms: [],
    bathrooms: [],
    city: [],
    commune: [],
    status: ['AVAILABLE'],
    features: [],
    amenities: [],
    utilities: [],
    accessibility: [],
    petPolicy: [],
    smokingPolicy: [],
    furnished: [],
    leaseTerm: [],
    targetTenant: [],
    nearTransit: false,
    nearSchools: false,
    nearHospitals: false,
    nearShopping: false,
    nearParks: false,
    nearRestaurants: false,
    buildingType: [],
    buildingAge: [],
    floor: [],
    orientation: [],
    view: [],
    lifestyle: [],
    atmosphere: [],
    community: [],
    security: [],
    specialRequirements: [],
    restrictions: [],
    preferences: [],
    availableFrom: '',
    availableTo: '',
    moveInFlexible: false,
    contactMethod: [],
    responseTime: []
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  // Filter sections configuration
  const filterSections: FilterSection[] = [
    {
      id: 'basic',
      title: 'Básicos',
      icon: Home,
      filters: ['propertyType', 'price', 'area', 'bedrooms', 'bathrooms', 'location']
    },
    {
      id: 'features',
      title: 'Características',
      icon: Star,
      filters: ['features', 'amenities', 'utilities', 'furnished']
    },
    {
      id: 'location',
      title: 'Ubicación',
      icon: MapPin,
      filters: ['nearTransit', 'nearSchools', 'nearHospitals', 'nearShopping', 'nearParks']
    },
    {
      id: 'building',
      title: 'Edificio',
      icon: Building,
      filters: ['buildingType', 'buildingAge', 'floor', 'orientation', 'view']
    },
    {
      id: 'lifestyle',
      title: 'Estilo de Vida',
      icon: Heart,
      filters: ['lifestyle', 'atmosphere', 'community', 'petPolicy', 'smokingPolicy']
    },
    {
      id: 'policies',
      title: 'Políticas',
      icon: Shield,
      filters: ['leaseTerm', 'targetTenant', 'restrictions', 'specialRequirements']
    }
  ];

  // Options for various filters
  const propertyTypes = [
    { value: 'apartment', label: 'Departamento' },
    { value: 'house', label: 'Casa' },
    { value: 'studio', label: 'Studio' },
    { value: 'loft', label: 'Loft' },
    { value: 'duplex', label: 'Dúplex' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'office', label: 'Oficina' }
  ];

  const features = [
    { value: 'wifi', label: 'Wifi', icon: Wifi },
    { value: 'parking', label: 'Estacionamiento', icon: Car },
    { value: 'gym', label: 'Gimnasio', icon: Gym },
    { value: 'pool', label: 'Piscina', icon: SwimmingPool },
    { value: 'garden', label: 'Jardín', icon: Garden },
    { value: 'balcony', label: 'Balcón', icon: Balcony },
    { value: 'terrace', label: 'Terraza', icon: Terrace },
    { value: 'aircon', label: 'Aire Acondicionado', icon: AirConditioning },
    { value: 'heating', label: 'Calefacción', icon: Heating },
    { value: 'elevator', label: 'Ascensor', icon: Elevator },
    { value: 'doorman', label: 'Conserje', icon: Doorman },
    { value: 'security', label: 'Seguridad 24h', icon: SecurityCamera },
    { value: 'furnished', label: 'Amoblado', icon: Home },
    { value: 'washer', label: 'Lavadora', icon: WashingMachine },
    { value: 'dishwasher', label: 'Lavavajillas', icon: Dishwasher },
    { value: 'refrigerator', label: 'Refrigerador', icon: Refrigerator },
    { value: 'microwave', label: 'Microondas', icon: Microwave },
    { value: 'tv', label: 'Televisor', icon: Tv }
  ];

  const amenities = [
    { value: 'rooftop', label: 'Terraza en Azotea' },
    { value: 'bbq', label: 'Área de BBQ' },
    { value: 'playground', label: 'Área de Juegos' },
    { value: 'sauna', label: 'Sauna' },
    { value: 'jacuzzi', label: 'Jacuzzi' },
    { value: 'tennis', label: 'Cancha de Tenis' },
    { value: 'basketball', label: 'Cancha de Básquetbol' },
    { value: 'biking', label: 'Zona de Bicis' },
    { value: 'hiking', label: 'Senderismo' },
    { value: 'beach', label: 'Acceso a Playa' },
    { value: 'lake', label: 'Acceso a Lago' },
    { value: 'forest', label: 'Cerca de Bosque' }
  ];

  const cities = [
    'Santiago', 'Viña del Mar', 'Valparaíso', 'Concepción', 'La Serena',
    'Antofagasta', 'Temuco', 'Rancagua', 'Talca', 'Chillán', 'Iquique'
  ];

  const communes = [
    'Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia', 'Ñuñoa',
    'Santiago Centro', 'La Reina', 'Macul', 'San Miguel', 'Estación Central',
    'Reñaca', 'Viña del Mar Centro', 'Valparaíso Cerro', 'Concepción Centro'
  ];

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties, sortBy]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      // Mock properties data
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Departamento Amoblado Premium - Las Condes',
          description: 'Exclusivo departamento amoblado en Las Condes con vistas panorámicas y acabados de lujo. Ideal para profesionales que buscan comodidad y ubicación privilegiada.',
          address: 'Av. Apoquindo 3200, Las Condes',
          city: 'Santiago',
          commune: 'Las Condes',
          region: 'Metropolitana',
          price: 850000,
          deposit: 850000,
          bedrooms: 3,
          bathrooms: 2,
          area: 120,
          status: 'AVAILABLE',
          images: ['/luxury1.jpg', '/luxury2.jpg'],
          features: ['Amoblado', 'Estacionamiento', 'Gimnasio', 'Piscina', 'Aire Acondicionado', 'Calefacción', 'Ascensor', 'Seguridad 24h', 'Balcón', 'Vista panorámica'],
          ownerId: 'owner1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Studio Moderno - Providencia',
          description: 'Moderno studio en el corazón de Providencia, perfecto para estudiantes o jóvenes profesionales. Cerca de metro y restaurantes.',
          address: 'Av. Providencia 1234, Providencia',
          city: 'Santiago',
          commune: 'Providencia',
          region: 'Metropolitana',
          price: 350000,
          deposit: 350000,
          bedrooms: 1,
          bathrooms: 1,
          area: 45,
          status: 'AVAILABLE',
          images: ['/studio1.jpg', '/studio2.jpg'],
          features: ['Amoblado', 'Gimnasio', 'Aire Acondicionado', 'Ascensor', 'Cocina equipada'],
          ownerId: 'owner2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Casa Familiar - La Reina',
          description: 'Espaciosa casa familiar en La Reina con jardín, ideal para familias con niños. Segura y tranquila.',
          address: 'Calle Los Leones 567, La Reina',
          city: 'Santiago',
          commune: 'La Reina',
          region: 'Metropolitana',
          price: 1200000,
          deposit: 1200000,
          bedrooms: 4,
          bathrooms: 3,
          area: 200,
          status: 'AVAILABLE',
          images: ['/house1.jpg', '/house2.jpg'],
          features: ['Jardín', 'Estacionamiento 2 autos', 'Seguridad', 'Patio', 'Bodega', 'Calefacción'],
          ownerId: 'owner3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower) ||
        property.commune.toLowerCase().includes(searchLower)
      );
    }

    // Apply property type filter
    if (filters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyType.includes(property.type.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(property => 
      property.price >= filters.minPrice && property.price <= filters.maxPrice
    );

    // Apply area filter
    filtered = filtered.filter(property => 
      property.area >= filters.minArea && property.area <= filters.maxArea
    );

    // Apply bedrooms filter
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(property => 
        filters.bedrooms.includes(property.bedrooms)
      );
    }

    // Apply bathrooms filter
    if (filters.bathrooms.length > 0) {
      filtered = filtered.filter(property => 
        filters.bathrooms.includes(property.bathrooms)
      );
    }

    // Apply city filter
    if (filters.city.length > 0) {
      filtered = filtered.filter(property => 
        filters.city.includes(property.city)
      );
    }

    // Apply commune filter
    if (filters.commune.length > 0) {
      filtered = filtered.filter(property => 
        filters.commune.includes(property.commune)
      );
    }

    // Apply features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(property => 
        filters.features.every(feature => 
          property.features?.includes(feature)
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'area-desc':
        filtered.sort((a, b) => b.area - a.area);
        break;
      default:
        break;
    }

    setFilteredProperties(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'RENTED':
        return <Badge className="bg-blue-100 text-blue-800">Arrendado</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const toggleFilter = (filterType: keyof AdvancedFilters, value: any) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as any[];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterType]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      propertyType: [],
      minPrice: 0,
      maxPrice: 10000000,
      minArea: 0,
      maxArea: 1000,
      bedrooms: [],
      bathrooms: [],
      city: [],
      commune: [],
      status: ['AVAILABLE'],
      features: [],
      amenities: [],
      utilities: [],
      accessibility: [],
      petPolicy: [],
      smokingPolicy: [],
      furnished: [],
      leaseTerm: [],
      targetTenant: [],
      nearTransit: false,
      nearSchools: false,
      nearHospitals: false,
      nearShopping: false,
      nearParks: false,
      nearRestaurants: false,
      buildingType: [],
      buildingAge: [],
      floor: [],
      orientation: [],
      view: [],
      lifestyle: [],
      atmosphere: [],
      community: [],
      security: [],
      specialRequirements: [],
      restrictions: [],
      preferences: [],
      availableFrom: '',
      availableTo: '',
      moveInFlexible: false,
      contactMethod: [],
      responseTime: []
    });
  };

  const saveSearch = () => {
    const searchName = prompt('Nombre para guardar esta búsqueda:');
    if (searchName) {
      const newSearch = {
        id: Date.now().toString(),
        name: searchName,
        filters: { ...filters },
        createdAt: new Date().toISOString()
      };
      setSavedSearches(prev => [...prev, newSearch]);
      alert('Búsqueda guardada exitosamente');
    }
  };

  const loadSavedSearch = (savedSearch: any) => {
    setFilters(savedSearch.filters);
    setShowSavedSearches(false);
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Home className="w-16 h-16 text-blue-400" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            {getStatusBadge(property.status)}
          </div>
          <div className="absolute top-2 left-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/80 hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.commune}, {property.city}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-gray-500">
              {formatPrice(property.deposit)} depósito
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} dorm</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} baños</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          </div>
          
          {property.features && Array.isArray(property.features) && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{property.features.length - 4}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver detalles
            </Button>
            <Button 
              size="sm" 
              variant="outline"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por dirección, características o palabras clave..."
                className="pl-10"
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {filteredProperties.length} propiedades encontradas
                </span>
                <Button variant="outline" size="sm" onClick={saveSearch}>
                  Guardar búsqueda
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowSavedSearches(!showSavedSearches)}>
                  Búsquedas guardadas
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Limpiar filtros
                </Button>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Searches Modal */}
      {showSavedSearches && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle>Búsquedas Guardadas</CardTitle>
              <CardDescription>Tus búsquedas personalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              {savedSearches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tienes búsquedas guardadas</p>
              ) : (
                <div className="space-y-2">
                  {savedSearches.map(search => (
                    <div key={search.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{search.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(search.createdAt).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => loadSavedSearch(search)}>
                          Cargar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSavedSearches(prev => prev.filter(s => s.id !== search.id))}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button className="w-full mt-4" onClick={() => setShowSavedSearches(false)}>
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros Avanzados
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Limpiar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="basic">Básicos</TabsTrigger>
                    <TabsTrigger value="features">Caract.</TabsTrigger>
                    <TabsTrigger value="location">Ubicación</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    {/* Property Type */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipo de Propiedad</label>
                      <div className="grid grid-cols-2 gap-2">
                        {propertyTypes.map(type => (
                          <label key={type.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.propertyType.includes(type.value)}
                              onCheckedChange={() => toggleFilter('propertyType', type.value)}
                            />
                            <span className="text-sm">{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Rango de Precio: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                      </label>
                      <div className="space-y-2">
                        <Slider
                          value={[filters.minPrice, filters.maxPrice]}
                          onValueChange={(value) => setFilters(prev => ({ 
                            ...prev, 
                            minPrice: value[0], 
                            maxPrice: value[1] 
                          }))}
                          max={10000000}
                          step={50000}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Area Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Superficie: {filters.minArea}m² - {filters.maxArea}m²
                      </label>
                      <Slider
                        value={[filters.minArea, filters.maxArea]}
                        onValueChange={(value) => setFilters(prev => ({ 
                          ...prev, 
                          minArea: value[0], 
                          maxArea: value[1] 
                        }))}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Dormitorios</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <Button
                            key={num}
                            variant={filters.bedrooms.includes(num) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleFilter('bedrooms', num)}
                          >
                            {num}+
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Baños</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4].map(num => (
                          <Button
                            key={num}
                            variant={filters.bathrooms.includes(num) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleFilter('bathrooms', num)}
                          >
                            {num}+
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ciudad</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {cities.map(city => (
                          <label key={city} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.city.includes(city)}
                              onCheckedChange={() => toggleFilter('city', city)}
                            />
                            <span className="text-sm">{city}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    {/* Features */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Características</label>
                      <div className="grid grid-cols-2 gap-2">
                        {features.map(feature => (
                          <label key={feature.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.features.includes(feature.value)}
                              onCheckedChange={() => toggleFilter('features', feature.value)}
                            />
                            <span className="text-sm">{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comodidades</label>
                      <div className="grid grid-cols-2 gap-2">
                        {amenities.map(amenity => (
                          <label key={amenity.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.amenities.includes(amenity.value)}
                              onCheckedChange={() => toggleFilter('amenities', amenity.value)}
                            />
                            <span className="text-sm">{amenity.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Furnished */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amoblamiento</label>
                      <div className="space-y-2">
                        {[
                          { value: 'furnished', label: 'Amoblado' },
                          { value: 'semi-furnished', label: 'Semi-amoblado' },
                          { value: 'unfurnished', label: 'Sin amoblar' }
                        ].map(option => (
                          <label key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.furnished.includes(option.value)}
                              onCheckedChange={() => toggleFilter('furnished', option.value)}
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="space-y-4">
                    {/* Location Preferences */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Cercanía a</label>
                      <div className="space-y-2">
                        {[
                          { key: 'nearTransit', label: 'Transporte público' },
                          { key: 'nearSchools', label: 'Colegios/Universidades' },
                          { key: 'nearHospitals', label: 'Hospitales' },
                          { key: 'nearShopping', label: 'Centros comerciales' },
                          { key: 'nearParks', label: 'Parques y áreas verdes' },
                          { key: 'nearRestaurants', label: 'Restaurantes' }
                        ].map(pref => (
                          <label key={pref.key} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters[pref.key as keyof AdvancedFilters] as boolean}
                              onCheckedChange={(checked) => 
                                setFilters(prev => ({ ...prev, [pref.key]: checked as boolean }))
                              }
                            />
                            <span className="text-sm">{pref.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Commune */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comuna</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {communes.map(commune => (
                          <label key={commune} className="flex items-center space-x-2">
                            <Checkbox
                              checked={filters.commune.includes(commune)}
                              onCheckedChange={() => toggleFilter('commune', commune)}
                            />
                            <span className="text-sm">{commune}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 space-y-2">
                  <Button className="w-full" onClick={saveSearch}>
                    Guardar búsqueda
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearAllFilters}>
                    Limpiar todos los filtros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {filteredProperties.length} propiedades encontradas
                  </h1>
                  <p className="text-gray-600">
                    Resultados para tu búsqueda avanzada
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevancia</SelectItem>
                      <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                      <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                      <SelectItem value="newest">Más Recientes</SelectItem>
                      <SelectItem value="area-desc">Superficie: Mayor a Menor</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredProperties.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron propiedades</h3>
                    <p className="text-gray-600 mb-4">
                      Intenta ajustar tus filtros o términos de búsqueda
                    </p>
                    <Button onClick={clearAllFilters}>
                      Limpiar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-4"
              }>
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}