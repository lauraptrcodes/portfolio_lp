<script>
    import ProjectCard from "./projectCard.svelte";
    import ProjectModal from "./projectModal.svelte";

    let selectedProject = null;
    let projects = [
        { 
            title: 'SpectralFreeze with C++', 
            video: '/assets/videos/SpectralFreezeDemo.mp4', 
            image:'/assets/images/spectralfreeze.png', 
            description: 'SpectralFreeze ist ein Audio-Plugin, das im Rahmen des JUCE-Frameworks entwickelt wurde. Es analysiert das Spektrum des Eingangssignals und friert seine Magnituden zu gewählten Zeitpunkten ein. Entweder nach manueller Eingabe oder automatisiert in einer gewählten Frequenz. Die einzelnen Bänder des eingefrohrenen Spektrums können innerhalb eines spektralen Delays zeitlich versetzt werden, sodass komplexe Klang- und Rhythmusstrukturen erstellt werden können.', 
            technologies: ['JUCE', 'C++', 'Audio-Plugin'] 
        },
        { 
            title: 'Web Dev with Vue.js', 
            video: '/assets/videos/webdevvue.mp4', 
            image:'/assets/images/webdevvue.png', 
            description: 'Als Werkstudentin hatte ich die Möglichkeit innerhalb des Marketingteams eines Softwareunternehmens neue Komponenten für deren Website entlang professioneller UX-Designs mit Vue.js zu entwickeln. Die Entwicklungsarbeit erfolgte in enger Zusammenarbeit mit dem UX-Designer des Teams und verlief innerhalb des SCRUM-Frameworks. Die Codebase der Website ist sehr darauf bedacht so wenig wie möglich Abhänigkeiten durch das einbinden von fremden Frameworks zu erzeugen, sodass das Frontend größtenteils aus grundlegenden Web-Technologien besteht.', 
            //description: 'While being employed as a working student I had the chance to develop new components according to new UX-Designs. The codebase in that project valued being independent from foreign frame works.', 
            technologies: ['Vue.js', 'Frontend'] 
        },
        { 
            title: 'aether with svelte', 
            video: '/assets/videos/aetherdemo.mp4', 
            image:'/assets/images/aether.png', 
            description: 'Dieses Projekt existiert zurzeit nur als Frontend und befindet sich in der Entwicklung. aether ist ein von der Community kuratiertes Internetradio, das eine Plattform für Individuen bietet deren Music zu teilen. Abhängig von dem Standort des Nutzers zeigt einem aether die Underground-Szene in seiner Umgebung und stellt dem Nutzer Informationen über den aktuellen Track zur Verfügung, die ihn direkt zu mehr Musik des Artists, sowie zu deren nächsten Gig führt.', 
            //description: 'This project only exists as a frontend at the moment and is a project in progress. Aether is a community-curated internet radio, that lets the individuals in the crowd submit their music for the world to hear. Depending on your location, aether shows you new tracks in your area. The platform shows light on underground music and provides listeners with links to the artists music and information for their upcoming gig.', 
            technologies: ['svelte', 'Full-stack'] 
        },
        { 
            title: 'MetallicDelay with C++', 
            video: '/assets/videos/metallicDelay.mp4', 
            image:'/assets/images/metallicdelay.png', 
            description: 'MetallicDelay ist ein Audio-Plugin, das im Rahmen des JUCE-Frameworks entwickelt wurde. Es implementiert eine Delay-Struktur mit einer sehr kurzen Delay-Time (1 - 10ms), die in jeder Feedback-Schleife neue Harmonien durch nicht-lineare Verzerrung einbringt. Weitere Möglichkeiten den Outputklang zu formen beinhalten High- und Lowpass-Filter, sowie eine Auswahl an verschiedenen Verzerrungsverfahren.', 
            technologies: ['JUCE', 'C++', 'Audio-Plugin'] 
        },
        { 
            title: 'Bachelorarbeit: Mobile Device Wall', 
            video: '/assets/videos/BADemo.mp4', 
            image:'/assets/images/mobiledevicewall.png', 
            description: 'Das Projekt "Mobile Device Wall" ist im Rahmen meiner Bachelorarbeit im Fach Medieninformatik entstanden. Diese beschäftigt sich mit der Konzeption und Entwicklung einer Full-Stack-Anwendung, als Digitalisierung eines Ausleihsystems für mobile Endgeräte innerhalb eines Softwareunternehmens. Die Backend-Seite ergibt sich aus einer REST-API mit ASP.Net Core, einer Authentifizierung über unternehmensinterne GitLab-Accounts nach dem OAuth-2.0-Standard. Das Frontend basiert auf Angular in Kombination mit dem UI-Toolkit Ionic. Die Anwendung ist in Feature-Module (Dashboard, Lending, Profile) gegliedert und nutzt RxJS für asynchrone Datenflüsse.', 
            technologies: ['ASP.Net Core', 'C#', 'Angular', 'Ionic', 'OAuth'] 
        },
        { 
            title: 'QuizFest mit Angular und Quarkus', 
            video: '/assets/videos/QuizFest Demo.mp4', 
            image:'/assets/images/quizfest.png', 
            description: 'QuizFest ist im Rahmen meines Studiums im Fach Medieninformatik entstanden. Die zugehörige API basiert auf dem Java-Framework Quarkus und baut architektonisch auf dem Entity-Control-Boundary-Pattern auf. Sie ermöglicht es Nutzern eigene Quizze zu erstellen, zu bearbeiten oder zu spielen. Die Sicherheit für Nutzer wird dabei über OpenID Connect und Keycloak realisiert.', 
            technologies: ['Angular', 'Java', 'Quarkus', "REST-API"] 
        }
    ];

    function openProject(project) {
    selectedProject = project;
    }
    function closeProject() {
        selectedProject = null;
    }
</script>


 <!-- Duotone-Filter: Graustufen des Videos werden zwischen portfolio-blue (#0442BF) und Weiß gemappt -->
 <svg width="0" height="0" class="absolute">
     <filter id="duotone-blue" color-interpolation-filters="sRGB">
         <feColorMatrix type="matrix"
             values="0.2126 0.7152 0.0722 0 0
                     0.2126 0.7152 0.0722 0 0
                     0.2126 0.7152 0.0722 0 0
                     0      0      0      1 0" />
         <feComponentTransfer>
             <feFuncR type="table" tableValues="0.0157 1" />
             <feFuncG type="table" tableValues="0.2588 1" />
             <feFuncB type="table" tableValues="0.7490 1" />
         </feComponentTransfer>
     </filter>
 </svg>

<div class="">
    <div class="relative my-24 mx-auto flex flex-col md:flex-row flex-wrap gap-4 w-full max-w-6xl justify-items-center justify-center">
        {#each projects as project}
            <ProjectCard {project} onSelect={openProject}></ProjectCard>
        {/each}
    </div>
</div>

<ProjectModal project={selectedProject} onClose={closeProject} />