
package com.sharedcanvas.config;

import com.sharedcanvas.model.Artist;
import com.sharedcanvas.model.GalleryRoom;
import com.sharedcanvas.model.Painting;
import com.sharedcanvas.repository.ArtistRepository;
import com.sharedcanvas.repository.GalleryRoomRepository;
import com.sharedcanvas.repository.PaintingRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    private record Artwork(
            String title,
            int year,
            String medium,
            String description,
            String artist
    ) {}

    private record RoomSeed(
            String code,
            String name,
            String theme,
            List<Artwork> artworks
    ) {}

    @Bean
    CommandLineRunner seedDatabase(
            ArtistRepository artists,
            GalleryRoomRepository rooms,
            PaintingRepository paintings
    ) {
        return args -> {

            List<RoomSeed> gallery = List.of(

                new RoomSeed("DEMO01", "The Shared Canvas",
                    "Classic", List.of(
                    new Artwork("Starry Night", 1889, "Oil on canvas",
                        "A swirling night sky above a quiet village.",
                        "Vincent van Gogh"),
                    new Artwork("Water Lilies", 1916, "Oil on canvas",
                        "Water lilies float across a peaceful pond.",
                        "Claude Monet"),
                    new Artwork("The Kiss", 1908, "Oil and gold leaf",
                        "Two figures embrace in a decorative golden composition.",
                        "Gustav Klimt"),
                    new Artwork("Portrait of Adele Bloch-Bauer I", 1907,
                        "Oil and gold leaf",
                        "A portrait with intricate golden decoration.",
                        "Gustav Klimt"),
                    new Artwork("Tree of Life", 1909, "Mixed media",
                        "A decorative tree with curling branches.",
                        "Gustav Klimt"),
                    new Artwork("Judith I", 1901, "Oil on canvas",
                        "A richly ornamented symbolic portrait.",
                        "Gustav Klimt"),
                    new Artwork("Danae", 1907, "Oil on canvas",
                        "A mythological figure in a golden palette.",
                        "Gustav Klimt"),
                    new Artwork("Hope II", 1907, "Oil on canvas",
                        "A symbolic composition with patterned clothing.",
                        "Gustav Klimt")
                )),

                new RoomSeed("ART002", "Renaissance Masters",
                    "Renaissance", List.of(
                    new Artwork("The Last Supper", 1498, "Mural",
                        "A Renaissance depiction of a biblical scene.",
                        "Leonardo da Vinci"),
                    new Artwork("Vitruvian Man", 1490, "Ink on paper",
                        "A study of human proportions.",
                        "Leonardo da Vinci"),
                    new Artwork("Lady with an Ermine", 1490, "Oil on panel",
                        "A portrait of a woman holding an ermine.",
                        "Leonardo da Vinci"),
                    new Artwork("The Annunciation", 1472, "Oil on panel",
                        "An early Renaissance religious scene.",
                        "Leonardo da Vinci"),
                    new Artwork("Salvator Mundi", 1500, "Oil on panel",
                        "A portrait of Christ with a raised hand.",
                        "Leonardo da Vinci"),
                    new Artwork("Ginevra de Benci", 1474, "Oil on panel",
                        "A Renaissance portrait against a landscape.",
                        "Leonardo da Vinci"),
                    new Artwork("Saint John the Baptist", 1513, "Oil on wood",
                        "A softly lit figure against a dark background.",
                        "Leonardo da Vinci"),
                    new Artwork("Madonna of the Carnation", 1478, "Oil on panel",
                        "A Madonna holding a small flower.",
                        "Leonardo da Vinci")
                )),

                new RoomSeed("ART003", "Picasso Gallery",
                    "Cubism", List.of(
                    new Artwork("Guernica", 1937, "Oil on canvas",
                        "An anti-war painting with fractured forms.",
                        "Pablo Picasso"),
                    new Artwork("Les Demoiselles d'Avignon", 1907,
                        "Oil on canvas",
                        "Angular figures challenge traditional perspective.",
                        "Pablo Picasso"),
                    new Artwork("The Weeping Woman", 1937, "Oil on canvas",
                        "A portrait using sharp shapes and vivid colors.",
                        "Pablo Picasso"),
                    new Artwork("Girl before a Mirror", 1932, "Oil on canvas",
                        "A figure faces a reflective mirror.",
                        "Pablo Picasso"),
                    new Artwork("Three Musicians", 1921, "Oil on canvas",
                        "Musicians assembled from geometric shapes.",
                        "Pablo Picasso"),
                    new Artwork("The Old Guitarist", 1903, "Oil on panel",
                        "A blue-toned musician holding a guitar.",
                        "Pablo Picasso"),
                    new Artwork("Portrait of Dora Maar", 1937, "Oil on canvas",
                        "A fragmented cubist portrait.",
                        "Pablo Picasso"),
                    new Artwork("Harlequin", 1917, "Oil on canvas",
                        "A colorful theatrical figure.",
                        "Pablo Picasso")
                )),

                new RoomSeed("ART004", "Dutch Golden Age",
                    "Classic", List.of(
                    new Artwork("The Night Watch", 1642, "Oil on canvas",
                        "A dramatic group portrait of a militia company.",
                        "Rembrandt van Rijn"),
                    new Artwork("The Return of the Prodigal Son", 1669,
                        "Oil on canvas",
                        "A moving scene of forgiveness and reunion.",
                        "Rembrandt van Rijn"),
                    new Artwork("The Anatomy Lesson", 1632, "Oil on canvas",
                        "A group studies anatomy in a dramatic interior.",
                        "Rembrandt van Rijn"),
                    new Artwork("Self-Portrait", 1659, "Oil on canvas",
                        "An introspective portrait of the artist.",
                        "Rembrandt van Rijn"),
                    new Artwork("The Jewish Bride", 1667, "Oil on canvas",
                        "An intimate portrait of two figures.",
                        "Rembrandt van Rijn"),
                    new Artwork("Belshazzar's Feast", 1635, "Oil on canvas",
                        "A dramatic biblical banquet scene.",
                        "Rembrandt van Rijn"),
                    new Artwork("Bathsheba at Her Bath", 1654, "Oil on canvas",
                        "A quiet, contemplative biblical scene.",
                        "Rembrandt van Rijn"),
                    new Artwork("The Storm on the Sea of Galilee", 1633,
                        "Oil on canvas",
                        "A boat struggles through rough water.",
                        "Rembrandt van Rijn")
                )),

                new RoomSeed("ART005", "Van Gogh Collection",
                    "Post-Impressionism", List.of(
                    new Artwork("The Starry Night over the Rhone", 1888,
                        "Oil on canvas",
                        "Night reflections shimmer on the river.",
                        "Vincent van Gogh"),
                    new Artwork("Café Terrace at Night", 1888, "Oil on canvas",
                        "A warmly lit cafe beneath a starry sky.",
                        "Vincent van Gogh"),
                    new Artwork("The Night Cafe", 1888, "Oil on canvas",
                        "A cafe interior in vivid contrasting colors.",
                        "Vincent van Gogh"),
                    new Artwork("Bedroom in Arles", 1888, "Oil on canvas",
                        "A brightly colored bedroom interior.",
                        "Vincent van Gogh"),
                    new Artwork("At Eternity's Gate", 1890, "Oil on canvas",
                        "A seated figure conveys deep emotion.",
                        "Vincent van Gogh"),
                    new Artwork("The Old Tower in the Fields", 1884,
                        "Oil on canvas",
                        "A weathered tower rises above a landscape.",
                        "Vincent van Gogh"),
                    new Artwork("Wheatfield with Crows", 1890, "Oil on canvas",
                        "Crows fly above a dramatic wheat field.",
                        "Vincent van Gogh"),
                    new Artwork("Irises", 1889, "Oil on canvas",
                        "Blue irises grow in a vibrant garden.",
                        "Vincent van Gogh")
                )),

                new RoomSeed("ART006", "Modern Art",
                    "Modern", List.of(
                    new Artwork("The Maiden", 1913, "Oil on canvas",
                        "A circular composition of intertwined figures.",
                        "Gustav Klimt"),
                    new Artwork("Portrait of Emilie Floge", 1902,
                        "Oil on canvas",
                        "A portrait with elaborate patterns.",
                        "Gustav Klimt"),
                    new Artwork("Avenue in the Park", 1910, "Oil on canvas",
                        "Trees form a colorful avenue.",
                        "Gustav Klimt"),
                    new Artwork("The Dance", 1910, "Oil on canvas",
                        "Figures form a decorative dancing composition.",
                        "Henri Matisse"),
                    new Artwork("The Red Studio", 1911, "Oil on canvas",
                        "Objects emerge from a vivid red interior.",
                        "Henri Matisse"),
                    new Artwork("The Snail", 1953, "Cut paper collage",
                        "A spiral made from colorful paper shapes.",
                        "Henri Matisse"),
                    new Artwork("Icarus", 1947, "Cut paper collage",
                        "A dark figure surrounded by bright shapes.",
                        "Henri Matisse"),
                    new Artwork("The Blue Room", 1901, "Oil on canvas",
                        "A room filled with cool blue tones.",
                        "Pablo Picasso")
                )),

                new RoomSeed("ART007", "Portrait Gallery",
                    "Portraits", List.of(
                    new Artwork("Girl with a Pearl Earring", 1665,
                        "Oil on canvas",
                        "A portrait featuring a luminous pearl earring.",
                        "Johannes Vermeer"),
                    new Artwork("Self-Portrait with a Straw Hat", 1887,
                        "Oil on canvas",
                        "A portrait with energetic brushwork.",
                        "Vincent van Gogh"),
                    new Artwork("Portrait of a Young Woman", 1910,
                        "Oil on canvas",
                        "A softly colored portrait study.",
                        "Gustav Klimt"),
                    new Artwork("The Blue Boy", 1770, "Oil on canvas",
                        "A young figure in a blue costume.",
                        "Thomas Gainsborough"),
                    new Artwork("American Gothic", 1930, "Oil on canvas",
                        "A stern pair posed before a farmhouse.",
                        "Grant Wood"),
                    new Artwork("Whistler's Mother", 1871, "Oil on canvas",
                        "A restrained portrait of the artist's mother.",
                        "James McNeill Whistler"),
                    new Artwork("Mona Lisa", 1503, "Oil on panel",
                        "A famous Renaissance portrait.",
                        "Leonardo da Vinci"),
                    new Artwork("The Two Fridas", 1939, "Oil on canvas",
                        "Two versions of the artist sit side by side.",
                        "Frida Kahlo")
                )),

                new RoomSeed("ART008", "Abstract Expressions",
                    "Abstract", List.of(
                    new Artwork("Composition VII", 1913, "Oil on canvas",
                        "An energetic abstract composition.",
                        "Wassily Kandinsky"),
                    new Artwork("Broadway Boogie Woogie", 1943, "Oil on canvas",
                        "A grid inspired by city movement and music.",
                        "Piet Mondrian"),
                    new Artwork("No. 5, 1948", 1948, "Oil and fiberboard",
                        "Dripping lines form an abstract composition.",
                        "Jackson Pollock"),
                    new Artwork("Black Square", 1915, "Oil on canvas",
                        "A landmark minimalist geometric composition.",
                        "Kazimir Malevich"),
                    new Artwork("The Persistence of Memory", 1931,
                        "Oil on canvas",
                        "Surreal melting clocks in a dreamlike landscape.",
                        "Salvador Dali"),
                    new Artwork("The Treachery of Images", 1929,
                        "Oil on canvas",
                        "A pipe challenges the relationship between image and object.",
                        "Rene Magritte"),
                    new Artwork("Orange and Yellow", 1956, "Oil on canvas",
                        "Large fields of glowing color.",
                        "Mark Rothko"),
                    new Artwork("Yellow-Red-Blue", 1925, "Oil on canvas",
                        "Color fields and geometric forms interact.",
                        "Wassily Kandinsky")
                )),

                new RoomSeed("ART009", "Impressionist Gallery",
                    "Impressionism", List.of(
                    new Artwork("Impression, Sunrise", 1872, "Oil on canvas",
                        "A hazy sunrise over a harbor.",
                        "Claude Monet"),
                    new Artwork("Woman with a Parasol", 1875, "Oil on canvas",
                        "A woman stands outdoors with a parasol.",
                        "Claude Monet"),
                    new Artwork("Rouen Cathedral", 1894, "Oil on canvas",
                        "The cathedral facade changes under shifting light.",
                        "Claude Monet"),
                    new Artwork("Dance at Le Moulin de la Galette", 1876,
                        "Oil on canvas",
                        "People dance at a lively outdoor gathering.",
                        "Pierre-Auguste Renoir"),
                    new Artwork("Luncheon of the Boating Party", 1881,
                        "Oil on canvas",
                        "Friends gather beside the water.",
                        "Pierre-Auguste Renoir"),
                    new Artwork("A Bar at the Folies-Bergere", 1882,
                        "Oil on canvas",
                        "A barmaid stands before a busy mirror.",
                        "Edouard Manet"),
                    new Artwork("The Ballet Class", 1874, "Oil on canvas",
                        "Dancers practice under their instructor.",
                        "Edgar Degas"),
                    new Artwork("The Cradle", 1872, "Oil on canvas",
                        "A mother watches over a sleeping child.",
                        "Berthe Morisot")
                )),

                new RoomSeed("ART010", "Nature and Landscapes",
                    "Landscape", List.of(
                    new Artwork("The Great Wave", 1831, "Woodblock print",
                        "A towering wave rises over small boats.",
                        "Katsushika Hokusai"),
                    new Artwork("The Hay Wain", 1821, "Oil on canvas",
                        "A wagon crosses a rural river landscape.",
                        "John Constable"),
                    new Artwork("Wanderer above the Sea of Fog", 1818,
                        "Oil on canvas",
                        "A solitary figure looks over a misty landscape.",
                        "Caspar David Friedrich"),
                    new Artwork("The Scream", 1893, "Oil and pastel",
                        "A figure expresses anguish beneath a vivid sky.",
                        "Edvard Munch"),
                    new Artwork("The Garden of Earthly Delights", 1500,
                        "Oil on panel",
                        "A fantastical triptych filled with symbolic figures.",
                        "Hieronymus Bosch"),
                    new Artwork("The Fighting Temeraire", 1839,
                        "Oil on canvas",
                        "A ship is towed across a glowing sunset.",
                        "J. M. W. Turner"),
                    new Artwork("The Oxbow", 1836, "Oil on canvas",
                        "A sweeping view of a river and wilderness.",
                        "Thomas Cole"),
                    new Artwork("The Sleeping Gypsy", 1897, "Oil on canvas",
                        "A sleeping figure rests in a moonlit desert.",
                        "Henri Rousseau")
                ))
            );

            int addedRooms = 0;
            int addedPaintings = 0;

            for (RoomSeed roomSeed : gallery) {

                GalleryRoom room = rooms
                        .findByRoomCode(roomSeed.code())
                        .orElseGet(() -> rooms.save(
                                new GalleryRoom(
                                        roomSeed.code(),
                                        roomSeed.name(),
                                        roomSeed.theme()
                                )
                        ));

                room.setRoomName(roomSeed.name());
                room.setTheme(roomSeed.theme());
                room = rooms.save(room);

                List<Painting> existingPaintings =
                        paintings.findByRoomId(room.getId());

                for (Artwork artwork : roomSeed.artworks()) {

                    boolean exists = existingPaintings.stream()
                            .anyMatch(p -> p.getTitle()
                                    .equalsIgnoreCase(artwork.title()));

                    if (exists) {
                        continue;
                    }

                    Artist artist = artists.findAll().stream()
                            .filter(a -> a.getName()
                                    .equalsIgnoreCase(artwork.artist()))
                            .findFirst()
                            .orElseGet(() -> artists.save(
                                    new Artist(
                                            artwork.artist(),
                                            "Unknown",
                                            artwork.artist()
                                                + " is featured in "
                                                + "The Shared Canvas."
                                    )
                            ));

                    Painting painting = new Painting(
                            artwork.title(),
                            artwork.year(),
                            artwork.medium(),
                            artwork.description(),
                            "",
                            artist,
                            room
                    );

                    paintings.save(painting);
                    addedPaintings++;
                }

                addedRooms++;
            }

            System.out.println("==================================");
            System.out.println(" THE SHARED CANVAS DATABASE");
            System.out.println(" Gallery rooms processed: " + addedRooms);
            System.out.println(" New paintings added: " + addedPaintings);
            System.out.println(" Target: 10 rooms, 80 paintings");
            System.out.println("==================================");
        };
    }
}
