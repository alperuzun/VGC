# VGC 

Variant Graph Craft (VGC) is an interactive genomic variant visualization program. Variant Graph Craft (VGC) offers a wide range of features for exploring genetic variations, including the ability to extract variant data, visualize variants and provide a graph representation of samples along with genotype data. The tool also integrates with external resources to provide information about gene function and variant frequency in different populations. VGC offers gene function and pathway information from Msig Database for GO terms, as well as KEGG, Biocarta, PID, and Reactome. The tool also provides a dynamic link to gnomAD for variant information, and includes ClinVar data for pathogenic variant information.

## Table of contents

- [Installation](#installation)
- [Getting Started](#getting-started)
	- [The VCF File Format](#the-vcf-file-format)
	- [Uploading a File](#uploading-a-file)
	- [Removing a File](#removing-a-file)
- [Database Version Info](#database-version-info)
- [Navigation](#navigation)
- [Visualization](#visualization)
	- [Bar Graph](#bar-graph)
	- [Variant Data](#variant-data)
	- [Node Graph](#node-graph)
	- [Compare Samples](#compare-samples)
	- [Gene Data](#gene-data)
- [Using a Phenotype File](#using-a-phenotype-file)
	- [Phenotype File Format](#phenotype-file-format)
	- [Uploading Phenotype Data](#uploading-phenotype-data)
- [Search Bars](#search-bars)
	- [Searching by Gene](#searching-by-gene)
	- [Searching by Range](#searching-by-range)
- [Contact](#contact)
## Installation

To install VGC, click on the link corresponding to your operating system. Download and expand the zip file, and double click on the application icon to start.  

| System | Installation Link |
| --- | --- |
| MacOS (darwin-x64) | [Download](https://drive.google.com/file/d/1dqoqfZLQoPmRU7KnFRfY5UJBdq6E4Kzp/view?usp=sharing) |
| Windows (win32-x64) | [Download](https://drive.google.com/file/d/1MTh7oiTyfj7K3B6wg59rKMehBtOac9yH/view?usp=sharing) |
| Linux (linux-arm64) | [Download](https://drive.google.com/file/d/1Rtjjhv94P-cRZEh30dH19E0m7NyBn7dm/view?usp=sharing)|

## Getting Started

### The VCF File Format

VGC accepts files with the `.vcf` file extension. The VCF (Variant Call Format) file must contain meta-information lines, a header
line, and data lines each specifying information about a position in the genome. The header and data lines are tab-delimited, and positions appear in sorted order from smallest to largest. All entries for a specific chromosome must appear as a contiguous block within the VCF file. 

For more information on the VCF file format, see detailed documentation [here](https://samtools.github.io/hts-specs/VCFv4.2.pdf). 

### Uploading a File

To upload a file, use the `+` button located on the top right of the side bar. Select the a `.vcf` file for visualization, and click `upload`. The program will automatically begin indexing the file for display once processing is complete.

### Removing a File

To remove a file, click the pencil icon labeled `Edit VCF(s)`. Then, click the `delete` button which will appear in place of the `upload phenotype` button. 

## Database Version Info

| Database | Version Used (Source) |
| --- | --- |
| ClinVar | Last Updated: April 1, 2024 |
| Biocarta Pathways Dataset | GSEA \| MSigDB Release Version: 7.5.1  |
| KEGG: Kyoto Encyclopedia of Genes and Genomes | GSEA \| MSigDB Release Version: 7.5.1 |
| PID: Pathway Interaction Database | GSEA \| MSigDB Release Version: 7.5.1 |
| BP: Gene sets derived from the GO Biological Process ontology | GSEA \| MSigDB Release Version: 7.5.1 |
| CC: Gene sets derived from the GO Cellular Component ontology | GSEA \| MSigDB Release Version: 7.5.1 |
| MF: Gene sets derived from the GO Molecular Function ontology | GSEA \| MSigDB Release Version: 7.5.1 |
| OMIM (Online Mendelian Inheritance in Man) | Generated: August 5, 2022 |


## Navigation

To switch between multiple uploaded VCFs, click on the desired file on the left sidebar.

Use the navigation buttons to switch between visualization options. These include `Bar Graph`, `Variant Data`, `Node Graph`, `Compare Samples`, and `Gene Data`. 

Two search bars for gene name and variant position range are located at the top of the navigation bar. For a given VCF file, the searched term will persist between visualization options. For instance, if a user is visualizing `ALPL` under `Bar Graph`, switching to `Variant Data` will automatically bring up all variants for `ALPL` gene in the selected VCF file. However, note that the searched term will persist between files; switching between two VCF files will reset both search bars. 

## Visualization

### Bar Graph

The `Bar Graph` tab displays a histogram of the selected VCF file's variant data. Each bar represents the number of variants in a specific chromosome or region. The forward and backward arrows allow for navigation through viewing history.

When a VCF file is initially uploaded, a default Bar Graph view will display all variants by chromosome present in the file. Hovering over a bar will display an info box, which contains information on the number of variants in the region as well as the range the data point covers. Clicking on a bar will zoom in, allowing for a closer examination of the variants present in the specified range.

At higher zoom levels, the hover box will indicate the gene which the specified variant(s) belong to, as well as whether the variant(s) are in an intronic or exonic region. Bars are colored coded, with exons and introns indicated using darker and lighter purple, respectively.

At the highest zoom level, with each bar representing an individual variant, the hover box will also display ClinVar information. If there are multiple variants in the ClinVar database at the specified position, the info box will provide information on each variant. Clicking on the bars representing single variants will open a dynamic link to the Broad Institute's gnomAD database, searching the selected variant automatically.

### Variant Data

The `Variant Data` tab presents variant data in a table format using Syncfusion. To get started, use the gene search bar or the range search bar to query a gene name or a range. The resulting variants will be displayed in the same format as the VCF file, represented as a spreadsheet. 

### Node Graph

The `Node Graph` tab displays a gene's or range's associated variants and all the patients with those variants in their genome using react-force-graph. The search bars can be used to query a gene or range, or files can be uploaded for multiple genes or positions. The graph can be viewed in 2D or 3D and can be toggled using the buttons in the window.

Each gene or position search will display a separate Node Graph tab. The sample nodes and variant nodes can be dragged for a customized graph configuration, and the scroll wheel can be used for zooming. Clicking on a variant node will open a new window displaying the gnomAD database page for that variant’s region.

Variant information, including Clinvar information, will be displayed on the left side of the graph when clicking on a variant node, and hovering over variant nodes will display the chromosome and position where the variant is located and whether or not there is a matching variant in Clinvar. Links between sample and patient nodes will be displayed when a sample's genotype contains a variant. 

### Compare Samples

When a [phenotype file](#using-a-phenotype-file) is uploaded with the .vcf file, the `Compare Samples` tab displays Fisher’s Exact Test data on each variant in relation to the sample groups. This test is applied to each variant to identify if there is a significant difference in the abundance of the variant between two groups (e.g. cases and controls), by utilizing the Fisher Exact Test with Monte Carlo simulation. 

To perform this analysis, a `2 x 3` matrix is used, and a default value of `n = 2000` simulations is used. This information may help identify potential associations between the variants and the sample groups being compared.

### Gene Data

The `Gene Data` tab provides detailed information about a queried gene. Enter the gene name in the search bar to access the following information:

1. OMIM data related to the gene.
2. MSigDb data, including information on:
	* Biological processes and cellular components are affected
	* Molecular function
	* BioCarta pathway
	* KEGG pathway
	* PID pathway
	* Reactome pathway
3. A comprehensive list of all variants associated with the gene, categorized by pathogenicity into columns labeled “Pathogenic,” “Benign,” or “No Consensus.” Clicking on any of the variants in the columns will open a dynamic link to the gnomAd page for that variant, providing more detailed information. 


## Using a Phenotype File 
To view a VCF file together with phenotype data, an additional phenotype file with relevant information may be uploaded. This feature allows users to analyze sample groupings alongside their VCF data. 

### Phenotype File Format
The phenotype file must be tab-delimited. Each line in the file represents a sample and contains two fields: the sample name and the corresponding group number. 

An example of the correct file format:
```
<sample_name_1>    0
<sample_name_2>    0
<sample_name_3>    1
<sample_name_4>    1
```
Please note the following guidelines for the file format:

- Each line should represent a single sample.
- The sample name and group number should be separated by a tab character ('\t').
- The group number should be an integer starting from 0 and incrementing sequentially without gaps. For example, valid group numbers include 0, 1, but not 0, 3 or 1, 2.

### Uploading Phenotype Data

To upload the phenotype file and view the associated visualizations, follow these steps:

1. Prepare your phenotype data in the correct tab-separated file format as described above.
2. In the software, hover over the corresponding VCF file name in the side bar, and click the "Add Phenotype File" button.
5. Once the file is uploaded successfully, VGC will process the data and display the phenotype information in the `Node Graph` and `Compare Samples` visualization options.

## Search Bars 

To search for data relevant to certain genes or within a specified base pair range, use the search bars located at the top of the window.

### Searching by Gene

To search for data relevant to a specific gene,  enter the gene name in the gene search bar and click the search button (or press enter). 

### Searching by Range

To search for data within a specified range, use the range search bar. For instance, to search for data in the range from position `12030000` to `12040000` on chromosome 1, enter `1:12030000-12040000` in the range search bar and click the search button,or press enter. The program will display the relevant data.

## Contact 

Please contact [Dr. Alper Uzun](mailto:alper_uzun@brown.edu) with any questions. 






