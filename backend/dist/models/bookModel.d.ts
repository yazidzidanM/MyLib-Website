import mongoose from "mongoose";
export interface Buku {
    id?: number;
    title: String;
    author: String;
    publisher: String;
    year: Number;
    genre: [String];
    synopsis: String;
    rating: Number;
    coverUrl: String;
}
export declare const bukuSchema: mongoose.Schema<Buku, mongoose.Model<Buku, any, any, any, mongoose.Document<unknown, any, Buku, any, {}> & Buku & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Buku, mongoose.Document<unknown, {}, mongoose.FlatRecord<Buku>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Buku> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const bukuModel: mongoose.Model<Buku, {}, {}, {}, mongoose.Document<unknown, {}, Buku, {}, mongoose.DefaultSchemaOptions> & Buku & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<Buku, mongoose.Model<Buku, any, any, any, mongoose.Document<unknown, any, Buku, any, {}> & Buku & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Buku, mongoose.Document<unknown, {}, mongoose.FlatRecord<Buku>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Buku> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=bookModel.d.ts.map